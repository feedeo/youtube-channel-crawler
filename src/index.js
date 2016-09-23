#!/usr/bin/env node

process.on('uncaughtException', error => {
  console.error(error)

  process.exit(1)
})

process.on('unhandledRejection', error => {
  console.error(error)

  process.exit(1)
})

const program = require('commander')

let apiKey
let username

program
  .version('1.0.0')
  .arguments('<apiKey> <username>')
  .action((_apiKey, _username) => {
    apiKey = _apiKey
    username = _username
  })
  .parse(process.argv)

if (!apiKey || !username) {
  program.outputHelp()

  process.exit(1)
}

const YouTubeChannelCrawler = require('../lib')
const instance = new YouTubeChannelCrawler({ apiKey })

// noinspection JSUnusedAssignment
instance.getChannelStatisticsByUsername(username)
  .then((statistics) => {
    console.log(JSON.stringify(statistics, null, 2))
  })
  .catch((error) => console.error(error))
