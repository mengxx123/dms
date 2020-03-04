let debug = process.env.NODE_ENV !== 'production'

let apiDomain
if (process.env.NODE_ENV === 'production') {
    apiDomain = 'https://dms-api.yunser.com'
} else {
    apiDomain = 'http://localhost:7002'
    // apiDomain = 'https://dms-api.yunser.com'
}

module.exports = {
    apiDomain,
    debug
}
