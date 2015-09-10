var http = require('https');
var config = require('../config/config.js');
var TwitterClient = require('twitter');
var fs = require('fs'),
  request = require('request');
var path = require('path');
var io = null;
var chalk = require('chalk');

var client = new TwitterClient({
  consumer_key: config.twitter.consumerKey,
  consumer_secret: config.twitter.consumerSecret,
  access_token_key: config.twitter.accessToken,
  access_token_secret: config.twitter.accessTokenSecret
});

querystring = require('querystring');


var Twitter = function() {};

Twitter.prototype.tweet = function(message) {
  try {
    client.post('statuses/update', {
      status: message
    }, function(error, tweet, response) {
      if (!error) {
        console.log(chalk.green("Tweet Success"));
      } else {
        console.log(chalk.red("Tweet failed"));
      }
    });
  } catch (e) {
    console.log("something went wrong");
  } finally {

  }

};



Twitter.prototype.stream = function(subject) {
  console.log("Streaming: " + subject);
  client.stream('statuses/filter', {
    track: subject
  }, function(stream) {
    stream.on('data', function(tweet) {

      // try {
      //   //console.log(tweet.extended_entities['media'][0].type);
      //   if (tweet.extended_entities['media'][0].type == "video") {
      //     //console.log("video");
      //     //console.log(tweet.extended_entities.media[0].video_info.variants[0].url);
      //     saveVideo(tweet.extended_entities.media[0].video_info.variants[0].url, tweet.extended_entities.media[0].id);
      //     //saveImage(tweet.entities['media'][0].media_url, tweet.entities['media'][0].id);
      //
      //     //io.emit('image', tweet.entities['media'][0].media_url);
      //   } else if (tweet.entities['media'][0].type == "animated_gif") {
      //     saveGif(tweet.extended_entities.media[0].video_info.variants[0].url, tweet.extended_entities.media[0].id);
      //   } else if (tweet.entities['media'][0].type == "photo") {
      //     saveImage(tweet.entities['media'][0].media_url, tweet.entities['media'][0].id);
      //   } else {
      //     //console.log("no image");
      //   }
      // } catch (e) {
      //
      // } finally {
      //
      // }
      console.log(chalk.blue('@' + tweet.user.screen_name) + ' ' + tweet.text);
    });

    stream.on('error', function(error) {
      console.log("ERROR");
      throw error;
    });
  });
}

function saveVideo(url, name) {
  name = "videos/" + name + path.extname(url);
  if (path.extname(url) === '.mp4') {
    download(url, name, function() {
      //console.log('done');
    });
  }
};

function saveGif(url, name) {
  name = "gif/" + name + path.extname(url);

  download(url, name, function() {});

};

function saveImage(url, name) {
  name = "images/" + name + path.extname(url);
  download(url, name, function() {});
};

var download = function(uri, filename, callback) {
  request.head(uri, function(err, res, body) {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};



exports.Twitter = Twitter;
