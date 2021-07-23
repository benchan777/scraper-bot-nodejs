const timer = (delayMs) => {
    return new Promise( (resolve, reject) => {
        setTimeout(resolve, delayMs)
    })
}

module.exports = {
    timer: timer,
}