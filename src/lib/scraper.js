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
const countryLoafScraper = (countryLoafStock, fulfillable) => {
    return new Promise( (resolve, reject) => {
        axios({
            method: 'get',
            url: url,
        })
        .then( response => {
            let currentStock
            let isFulfillable

            const $ = cheerio.load(response.data);
            const menuData = $.html().match(/menu_data = (.*);/)[1];

            const menuDataJson = JSON.parse(menuData)

            // Fulfillable array determines if items display as in stock
            // If an item is marked as in stock but isn't present in the array, it will still display as out of stock on website
            const fulfillableMenuitemIds = menuDataJson.fulfillable_menuitem_ids
            isFulfillable = fulfillableMenuitemIds.includes(process.env.itemId)

            // Checks if the item ID exists. If not, the ID of the item has probably changed and needs to be updated
            if (menuDataJson.menuItems[process.env.itemId]) {
                currentStock = menuDataJson.menuItems[process.env.itemId]['in_stock']
            } else {
                reject("Unable to find specified item ID. Item ID likely needs to be updated. Check Tartine's site for updated ID.")
            }
            
            // Checks current stock against stock from previous scrape
            // If stock has changed, send notifications
            if (currentStock != countryLoafStock || fulfillable != isFulfillable) {
                if (currentStock == true && isFulfillable == true) {
                    sendText('Available')
                    .then( data => {
                        resolve({ currentStock: currentStock, isFulfillable: isFulfillable})
                        console.log(data)
                        // axios.post(`https://maker.ifttt.com/trigger/available/with/key/${process.env.iftttKey}`)
                    })
                    .catch( error => {
                        reject(`Error at sendText: ${error}`)
                    })
                } else if (isFulfillable == false) {
                    sendText('Unavailable')
                    .then( data => {
                        resolve({ currentStock: currentStock, isFulfillable: isFulfillable})
                        console.log(data)
                    })
                    .catch( error => {
                        reject(`Error at sendText: ${error}`)
                    })
                } else if (currentStock == false) {
                    sendText('Unavailable')
                    .then( data => {
                        resolve({ currentStock: currentStock, isFulfillable: isFulfillable})
                        console.log(data)
                    })
                    .catch( error => {
                        reject(`Error at sendText: ${error}`)
                    })
                } else {
                    reject("Unable to find specified item ID. Item ID likely needs to be updated. Check Tartine's site for updated ID.")
                }
            } else {
                resolve({ currentStock: currentStock, isFulfillable: isFulfillable})
            }
        })
        .catch( error => {
            reject(`Error at axios: ${error.message}`)
        })
    })
}

module.exports = {
    countryLoafScraper: countryLoafScraper,
}