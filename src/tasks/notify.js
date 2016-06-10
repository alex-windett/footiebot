
'use strict'

const _ = require('lodash')
const config = require('../config')
const trending = require('github-trending')
const Botkit = require('botkit')
var request = require('request')
var util = require('util')

var controller = Botkit.slackbot({})
var bot = controller.spawn()

bot.configureIncomingWebhook({ url: config('WEBHOOK_URL') })

request('http://api.football-data.org/v1/soccerseasons/424/fixtures', function (error, response, body) {
    if (!error && response.statusCode == 200) {

        const msgDefaults = {
          response_type: 'in_channel',
          username: 'Starbot',
          icon_emoji: config('ICON_EMOJI')
        }
        
        // var body = JSON.stringify( body )
        body = JSON.parse(body)
        var fixtures = body.fixtures

        var attachments = fixtures.map((fixture) => {
            var fixtureDate = fixture.date
            var awayTeam = fixture.awayTeamName
            var homeTeam = fixture.homeTeamName
            var result  = fixture.result
            var awayGoals = result.goalsAwayTeam
            var homeGoals = result.goalsHomeTeam

            return {
              title: `${homeTeam} - ${homeGoals} V  ${awayGoals} ${awayTeam} `,
              title_link: fixtureDate,
              mrkdwn_in: ['text', 'pretext']
            }
        //   return {
        //     title: `${repo.owner}/${repo.title} `,
        //     title_link: repo.url,
        //     text: `_${repo.description}_\n${repo.language} • ${repo.star}`,
        //     mrkdwn_in: ['text', 'pretext']
        //   }
        })

        console.log(attachments)

        let msg = _.defaults({ attachments: attachments }, msgDefaults)

        bot.sendWebhook(msg, (err, res) => {
          if (err) throw err

          console.log(`\n🚀  Starbot report delivered 🚀`)
        })
    }
});
// trending('javascript', (err, repos) => {
//   if (err) throw err
//
//   var attachments = repos.slice(0, 5).map((repo) => {
//     return {
//       title: `${repo.owner}/${repo.title} `,
//       title_link: repo.url,
//       text: `_${repo.description}_\n${repo.language} • ${repo.star}`,
//       mrkdwn_in: ['text', 'pretext']
//     }
//   })
//
//   let msg = _.defaults({ attachments: attachments }, msgDefaults)
//
//   bot.sendWebhook(msg, (err, res) => {
//     if (err) throw err
//
//     console.log(`\n🚀  Starbot report delivered 🚀`)
//   })
// })
