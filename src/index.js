require('dotenv').config();

// Helper functions
const scraper = require('../src/lib/scraper');
const helpers = require('../src/lib/helpers');

// Bot setup
const Discord = require('discord.js');
const { messageEmbed } = require('../src/lib/helpers');
const bot = new Discord.Client();

let countryLoafStock = 'N/A';
let stopLoop = 'False';

// Log bot into Discord
bot.login(process.env.TOKEN);

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`)
});

bot.on('message', msg => {
    if (msg.content == '!country') {
        stopLoop = 'False';

        function runScraper() {
            if (stopLoop == 'True') { // Stop loop if stop message detected
                return
            }

            return scraper.countryLoafScraper(countryLoafStock)
            .then( stock => { // Run scraper to get stock
                countryLoafStock = stock;
                helpers.messageEmbed(stock)
                .then( embed => { // Create embed using stock status, then send message to channel
                    msg.channel.send(embed)
                    .then( () => { // Delay 60s before scraping again
                        helpers.timer(60000)
                        .then( () => {
                            runScraper();
                        })
                    })
                })
            })
            .catch( error => {
                console.log(error)
                msg.channel.send('Error, something went wrong. Check logs for more details.')
            })
        }

        runScraper();

        // while (true) {
        //     if (stopLoop == 'True') {
        //         break;
        //     }
        //     const stock = await scraper.countryLoafScraper(countryLoafStock);
        //     const embed = await helpers.messageEmbed(stock)
        //     msg.channel.send(embed)
        //     countryLoafStock = stock
        //     await helpers.timer(60000)  
        // }
    }

    if (msg.content == '!stop') {
        stopLoop = 'True'
        msg.channel.send('Scraping terminated')
    }
})