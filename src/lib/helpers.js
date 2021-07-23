const Discord = require('discord.js');

const timer = (delayMs) => {
    return new Promise( (resolve, reject) => {
        setTimeout(resolve, delayMs)
    })
}

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

module.exports = {
    timer: timer,
    messageEmbed: messageEmbed,
}