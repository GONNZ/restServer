//=============================
// PORT
// ============================

process.env.PORT = process.env.PORT || 3000

//=============================
// ENVIRONMENT
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//=============================
// Expiration of the token
// ============================
// 60seg * 60min * 24h * 30d

process.env.EXPIRATION_TIMER_TOKEN = 60 * 60 * 24 * 30

//=============================
// Autentication SEED
// ============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

//=============================
// DATABASE
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    // heroku config:set MONGO_URI=""
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB