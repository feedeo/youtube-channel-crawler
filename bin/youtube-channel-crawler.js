#!/usr/bin/env node

process.on('uncaughtException', error => {
  console.error(error);

  process.exit(1)
});

process.on('unhandledRejection', error => {
  console.error(error);

  process.exit(1)
});

const program = require('commander');

const YoutubeChannelCrawler = require('../lib');

let apiKey;
let username;

program
  .version('1.0.0')
  .arguments('<apiKey> <username>')
  .action(function (a, u) {
    apiKey = a;
    username = u
  })
  .parse(process.argv);

if (!username) {
  console.error('Correct usage: youtube-channel-crawler <apiKey> <username>');
  process.exit(1)
}

// noinspection JSUnusedAssignment
YoutubeChannelCrawler.getChannelStatisticsByUsername(apiKey, username)
  .then((statistics) => {
    console.log(JSON.stringify(statistics, null, 2))
  })
  .catch((error) => console.error(error));
