
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
      username: 'Footiebot',
      icon_emoji: config('ICON_EMOJI')
    }

    if (!error && response.statusCode == 200) {

        // var body = JSON.stringify( body )
        body = JSON.parse(body)
        var fixtures = body.fixtures

        var finishedRecentlyFixtures = fixtures.map( fixture => {
            var now = new Date().getTime()
            var startTime = fixture.date
                startTime = startTime.split('T')
                startTime = startTime[0].split('-')
                startTime = Date.UTC(startTime[0], startTime[1], startTime[2])

            var timeSinceStart =  now - startTime

            if ( 7200 < timeSinceStart && timeSinceStart < 108000 ) {
                return fixture
            } else {
                return false
            }
        })

        if ( finishedRecentlyFixtures ) {

            var attachments = finishedRecentlyFixtures.map((fixture) => {
                var awayTeam = fixture.awayTeamName
                var homeTeam = fixture.homeTeamName
                var result  = fixture.result
                var awayGoals = result.goalsAwayTeam
                var homeGoals = result.goalsHomeTeam

                return {
                    title: 'Recent Results',
                    fields: [
                        {
                            title: homeTeam,
                            value: homeGoals
                        },
                        {
                            title: awayTeam,
                            value: awayGoals
                        }
                    ],
                }
            })
        } else {
            var attachments = {
                title: 'Nothing results yet',
            }
        }

        var attachments = {
            attachments,
            color: '#1d93d2',
            mrkdwn_in: ['text', 'pretext']
        }

        let msg = _.defaults({ attachments: attachments }, msgDefaults)

        bot.sendWebhook(msg, (err, res) => {
          if (err) throw err

          console.log(`\n🚀  Starbot report delivered 🚀`)
        })
    }
});
