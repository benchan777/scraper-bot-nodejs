const axios = require('axios').default;
const cheerio = require('cheerio');
const helpers = require('./helpers');
const url = 'https://guerrero.tartine.menu/pickup/'

const countryLoafScraper = (countryLoafStock) => {
    return new Promise( (resolve, reject) => {
        axios({
            method: 'get',
            url: url,
        })
            .then(response => {
                const $ = cheerio.load(response.data);
                const data = $.html();
                let tempString = ''
                const stockArray = []
                for (let i = 0; i < data.length; i ++) {
                    tempString += data[i]
                    if (tempString.includes('"in_stock": true') === true) {
                        stockArray.push('Available')
                        tempString = ''
                    }
                    if (tempString.includes('"in_stock": false') === true) {
                        stockArray.push('Not Available')
                        tempString = ''
                    }
                }

                if (stockArray[29] != countryLoafStock) {
                    if (stockArray[29] == 'Available') {
                        resolve(helpers.messageEmbed(stockArray[29]))
                    } else if (stockArray[29] == 'Not Available') {
                        resolve(helpers.messageEmbed(stockArray[29]))
                    } else {
                        reject('Failed to scrape')
                    }
                } else {
                    resolve(stockArray[29])
                }
            })
            .catch(error => {
                reject(error.message)
            })
    })
}

module.exports = {
    countryLoafScraper: countryLoafScraper,
}