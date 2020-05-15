const express = require('express')
const UsuarioModel = require('../models/usuario')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const app = express()


app.post('/login', (req, res) => {

    let body = req.body

    UsuarioModel.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Credenciales incorrectas -user'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Credenciales incorrectas -pass'
                }
            })
        }

        // Creación del token

        let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, {
            expiresIn: process.env.EXPIRATION_TIMER_TOKEN
        })

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    })
})






module.exports = app