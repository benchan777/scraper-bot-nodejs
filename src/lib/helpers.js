require('dotenv').config();
const nodemailer = require('nodemailer');
const Discord = require('discord.js');

// Timer for setting delay time between subsequent scraping sessions
const timer = (delay) => {
    return new Promise( (resolve, reject) => {
        setTimeout(resolve, delay)
    })
}

/**
 * Creates a Discord embed message with Green/Red color based on availability
 * @param {String} stock Bread stock status. Available = Green, Not Available = Red
 * @returns Discord embed
 */
const messageEmbed = (stock) => {
    return new Promise( (resolve, reject) => {
        let color = ''

        if (stock == 'Available') {
            color = '#00ff00'
        } else {
            color = '#ff0000'
        }
        const newEmbed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle('Country Loaf')
            .setThumbnail('https://s3.amazonaws.com/toasttab/restaurants/restaurant-13508000000000000/menu/items/8/item-200000007632874878_1598045606.jpg')
            .addField('Availability', stock, true)
        
        resolve(newEmbed)
    })
}

const sendText = (availability) => {
    return new Promise( (resolve, reject) => {
        const authentication = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: process.env.email,
                pass: process.env.password
            }
        })

        if (availability == 'Available') {
            authentication.sendMail({
                from: process.env.email,
                to: process.env.receiverEmail,
                subject: 'Country loaf in stock!',
                text: `Country loaf is now in stock! Order here: https://guerrero.tartine.menu/pickup/`
            })
            .then( status => {
                resolve(status)
            })
            .catch( error => {
                reject(error.message)
            })
        } else {
            authentication.sendMail({
                from: process.env.email,
                to: process.env.receiverEmail,
                subject: 'Country loaf out of stock.',
                text: `Country loaf is now out of stock. We will notify you when stock is replenished.`
            })
            .then( status => {
                resolve(status)
            })
            .catch( error => {
                reject(error.message)
            })
        }

    })
}

module.exports = {
    timer: timer,
    messageEmbed: messageEmbed,
    sendText: sendText,
}