require('dotenv').config();

// Helper functions
const scraper = require('../src/lib/scraper');
const helpers = require('../src/lib/helpers');

// Bot setup
const Discord = require('discord.js');
const bot = new Discord.Client();

let countryLoafStock = 'N/A';
let stopLoop = 'False';

// Log bot into Discord
bot.login(process.env.TOKEN);

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`)
});

bot.on('message', async msg => {
    if (msg.content == '$country_node') {
        countryLoafScraper = 'False'
        while (true) {
            if (stopLoop == 'True') {
                break;
            }
            const stock = await scraper.countryLoafScraper(countryLoafStock);
            const embed = await helpers.messageEmbed(stock)
            msg.channel.send(embed)
            countryLoafStock = stock
            await helpers.timer(60000)
        }
    }

    if (msg.content == '$stop') {
        countryLoafScraper = 'True'
        msg.channel.send('Scraping terminated')
    }
})