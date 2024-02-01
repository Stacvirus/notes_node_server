function info(...params) {
    process.env.NODE_ENV !== 'test' && console.log(...params);
}

function error(...params) {
    process.env.NODE_ENV !== 'test' && console.error(...params);
}

module.exports = { info, error };
