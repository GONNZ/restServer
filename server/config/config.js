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

process.env.EXPIRATION_TIMER_TOKEN = '48h'

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

//=============================
// GOOGLE CLIENT ID
// ============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '1064527545676-55icebnkv4fght427l2ncf7juhiniooq.apps.googleusercontent.com'