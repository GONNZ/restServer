const express = require('express')
const UsuarioModel = require('../models/usuario')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

app.post('/google', async(req, res) => {
    let token = req.body.idtoken

    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            err: e
        })
    })

    UsuarioModel.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                //El usuario ya existe y no fue marcado con autenticación de google
                //por lo que se le indica que ingrese sus credenciales de sistema
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Este correo ya existe en DB, favor autenticarse mediante las credenciales iniciales'
                    }
                })

            } else {
                // El usuario sí es autenticado por google, por ende se refresca el token como en login
                // Creación del token
                let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, {
                    expiresIn: process.env.EXPIRATION_TIMER_TOKEN
                })

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            //El usuario no existe en base de datos
            //Por lo tanto se crea uno nuevo con las credenciales google
            let usuario = new UsuarioModel({
                nombre: googleUser.name,
                email: googleUser.email,
                //Este campo no será requerido, se llena por la validación del modelo
                password: 'GoogleAut',
                google: true
            })

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                // Creación del token
                let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, {
                    expiresIn: process.env.EXPIRATION_TIMER_TOKEN
                })

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            })
        }
    })
})

//Configuración de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }


}


module.exports = app