/*
 * Copyright (c) 2016, Feedeo AB <hugo@feedeo.io>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Promise = require('bluebird')
const retry = require('bluebird-retry')
// noinspection JSUnresolvedFunction
const request = Promise.promisifyAll(require('request'))

class YouTubeChannelCrawler {
  constructor ({ apiKey }) {
    if (!apiKey) {
      throw new Error('missing required Youtube API key')
    }

    // noinspection JSUnresolvedVariable
    this.apiKey = apiKey
  }

  getChannelStatisticsByUsername (username) {
    const options = {
      uri: `https://www.googleapis.com/youtube/v3/channels?part=statistics&forUsername=${username}&key=${this.apiKey}`,
      json: true
    }

    // noinspection JSUnresolvedFunction
    return retry(() => request.getAsync(options), { max_tries: 3, interval: 500 })
      .then(({ body }) => {
        if (body && body.error) {
          throw new Error(body.error.message)
        }

        // noinspection JSUnresolvedVariable
        if (!body.items || body.items.length === 0 || !body.items[ 0 ].statistics) {
          throw new Error('Youtube API did not return a proper response')
        }

        // noinspection JSUnresolvedVariable
        return body.items[ 0 ].statistics
      })
  }
}

module.exports = YouTubeChannelCrawler

