const express = require('express')
const UsuarioModel = require('../models/usuario')
const bcrypt = require('bcrypt');
const _ = require('underscore')
const app = express()

app.get('/usuario', (req, res) => {
    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    UsuarioModel.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            UsuarioModel.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cantidad: conteo
                })

            })


        })
})

app.post('/usuario', async(req, res) => {
    let body = req.body
    const salt = await bcrypt.genSalt(10)

    const hashPass = await bcrypt.hash(req.body.password, salt)

    let usuario = new UsuarioModel({
        nombre: body.nombre,
        email: body.email,
        password: hashPass,
        role: body.role
    })

    usuario.save((err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //usuario.password = null

        res.json({
            ok: true,
            usuario
        })

    })

})

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])
    console.log(body);
    // delete body.password
    // delete body.google

    UsuarioModel.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, userDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: userDb
        })

    })


})

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id
    let cambiaEstado = { estado: false }

    UsuarioModel.findByIdAndUpdate(id, cambiaEstado, {
        new: true
    }, (err, userDel) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!userDel) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado en la BD'
                }
            })
        }
        res.json({
            ok: true,
            usuarioEliminado: userDel
        })

    })

})


module.exports = app