const express = require('express')
const { verificaTokenImg } = require('../middlewares/autentication')
const fs = require('fs')
const path = require('path')
let app = express()

app.get('/imagen/:tipo/:img', [verificaTokenImg], (req, res) => {

    let tipo = req.params.tipo
    let img = req.params.img


    let pathImgen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)

    if (fs.existsSync(pathImgen)) {

        res.sendFile(pathImgen)

    } else {

        let noImgPath = path.resolve(__dirname, '../assets/image-not-found.png')
        res.sendFile(noImgPath)
    }

})



module.exports = app