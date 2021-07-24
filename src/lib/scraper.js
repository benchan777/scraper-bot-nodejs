require('dotenv').config();
const axios = require('axios').default;
const cheerio = require('cheerio');
const { sendText } = require('./helpers')
const url = 'https://guerrero.tartine.menu/pickup/'

/**
 * Scrapes Tartine's website to check for availability of Country Loaf.
 * Also takes in stock status from previous scrape. If there is a change, notifications will be sent.
 * @param {String} countryLoafStock Stock status from previous scrape (Available/Not Available)
 * @returns Stoack status in string format. Either 'Available' or 'Not Available'
 */
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

                // Checks current stock against stock from previous scrape
                // If stock has changed, send notifications
                if (stockArray[29] != countryLoafStock) {
                    if (stockArray[29] == 'Available') {
                        sendText(stockArray[29])
                        .then( data => {
                            resolve(stockArray[29])
                            console.log(data)
                            // axios.post(`https://maker.ifttt.com/trigger/available/with/key/${process.env.iftttKey}`)
                        })
                        .catch ( error => {
                            reject(error)
                        })
                    } else if (stockArray[29] == 'Not Available') {
                        sendText(stockArray[29])
                        .then( data => {
                            resolve(stockArray[29])
                            console.log(data)
                        })
                        .catch ( error => {
                            reject(error)
                        })
                    } else {
                        reject('Failed to scrape')
                    }
                }

                resolve(stockArray[29])
            })
            .catch(error => {
                reject(error.message)
            })
    })
}

module.exports = {
    countryLoafScraper: countryLoafScraper,
}