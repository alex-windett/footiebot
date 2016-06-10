
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

    const msgDefaults = {
      response_type: 'in_channel',
      username: 'Starbot',
      icon_emoji: config('ICON_EMOJI')
    }

    if (!error && response.statusCode == 200) {

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

            var dateSplit = fixtureDate.split('T')
            var fixtureDate = dateSplit[0]

            if ( awayGoals || homeGoals ) {

                return {
                  title: `${homeTeam} - ${homeGoals} V  ${awayGoals} ${awayTeam} `,
                  title_link: fixtureDate,
                  mrkdwn_in: ['text', 'pretext']
                }
            } else {
                return {
                    title: 'There seems to be a problem here..'
                }
            }
        })

        let msg = _.defaults({ attachments: attachments }, msgDefaults)

        bot.sendWebhook(msg, (err, res) => {
          if (err) throw err

          console.log(`\n🚀  Starbot report delivered 🚀`)
        })
    }
});
