//=============================
// PORT
// ============================

process.env.PORT = process.env.PORT || 3000

//=============================
// ENVIRONMENT
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//=============================
// DATABASE
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://gonnzDev:pRjHQANVOn1cjqOO@cluster0-opl15.mongodb.net/test'
}

process.env.URLDB = urlDB

//=============================
// 
// ============================