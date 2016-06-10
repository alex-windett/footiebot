
'use strict'

const _ = require('lodash')
const config = require('../config')
const trending = require('github-trending')
const Botkit = require('botkit')
const http = require('http');

var controller = Botkit.slackbot({})
var bot = controller.spawn()

bot.configureIncomingWebhook({ url: config('WEBHOOK_URL') })

const msgDefaults = {
  response_type: 'in_channel',
  username: 'FOOTIEBOT',
  icon_emoji: config('ICON_EMOJI')
}

http.get(url, function(res) {
  // console.log("Got response: " + res.statusCode);

  res.on("data", function(chunk) {
    console.log("BODY: " + chunk);

    var attachments = repos.slice(0, 5).map((repo) => {
      return {
        title: `hello`,
        mrkdwn_in: ['text', 'pretext']
        // title: `${repo.owner}/${repo.title} `,
        // title_link: repo.url,
        // text: `_${repo.description}_\n${repo.language} • ${repo.star}`,
        // mrkdwn_in: ['text', 'pretext']
      }
    })

    let msg = _.defaults({ attachments: attachments }, msgDefaults)

    bot.sendWebhook(msg, (err, res) => {
      if (err) throw err

      console.log(`\n🚀  Starbot report delivered 🚀`)
    })

  });
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});
