function info(...params) {
    console.log(...params)
}

function error(...params) {
    console.error(...params)
}

module.exports = { info, error }