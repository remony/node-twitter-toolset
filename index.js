var chalk = require('chalk');
var commands = ["tweet", "stream"];
var config = require('./config/config.js');

var isWin = /^win/.test(process.platform);

if (!isWin) {
  console.log(chalk.white.bgRed("WARNING\nOnly Tested on Windows\n\n"));
}

var Twitter = require('./tools/twittercom.js').Twitter;
var twitter = new Twitter();


function getCommandPosition(array) {
  var foundIndex = null;
  process.argv.forEach(function(val, index, array) {
    commands.forEach(function(val2, index2, array2) {
      if (val === val2) {
        foundIndex = index;
      } else {
        return null;
      }
    })
  });
  return foundIndex;
}

function processTweet(args, comPos) {
  console.log(chalk.blue('Tweet'))
  var tweet = '';

  args.forEach(function(val, index, array) {
    if (index > comPos) {
      tweet += val + ' ';
    }
  });
  twitter.tweet(tweet);
  console.log(tweet);
}

function processInvalidCommand() {
  console.log(chalk.white.bgRed('Invalid command!') + '\n Please enter one of the following commands: \n');
  commands.forEach(function(val, index, array) {
    console.log(val);
  })
}


switch (process.argv[getCommandPosition(process.argv)]) {
  case 'tweet':
    processTweet(process.argv, getCommandPosition(process.argv));
    break;
  case 'stream':
    twitter.stream(process.argv[getCommandPosition(process.argv) + 1]);
    break;
  default:
    processInvalidCommand();
    break;
}
