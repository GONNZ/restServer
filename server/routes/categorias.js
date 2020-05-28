const express = require('express')
const CategoriaModel = require('../models/categoria')
const { tokenValidation, adminRoleValidation } = require('../middlewares/autentication')
const app = express()



app.get('/categoria', [tokenValidation], (req, res) => {

    CategoriaModel.find()
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            CategoriaModel.countDocuments({}, (err, conteo) => {

                res.json({
                    ok: true,
                    categoria,
                    cantidad: conteo
                })

            })

        })

})

app.get('/categoria/:id', [tokenValidation], (req, res) => {

    let id = req.params.id
    let body = req.body


    CategoriaModel.findById(id, (err, categoria) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoria) {
            return res.status(402).json({
                ok: false,
                err: {
                    message: 'No existe una categoría para el id indicado'
                }
            })
        }

        res.json({
            ok: true,
            categoria,
        })


    })

})

app.post('/categoria', [tokenValidation, adminRoleValidation], (req, res) => {

    let body = req.body

    let categoria = new CategoriaModel({
        nombre: body.nombre,
        usuario: req.usuario._id
    })

    categoria.save((err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoria) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria
        })

    })

})


app.put('/categoria/:id', [tokenValidation, adminRoleValidation], function(req, res) {

    let id = req.params.id
    let body = req.body
    let data = {
        nombre: body.nombre
    }


    CategoriaModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    }, (err, categoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    err,
                    message: 'El id ingresando no existe en DB'
                }
            })
        }

        res.json({
            ok: true,
            categoria
        })


    })

})

app.delete('/categoria/:id', [tokenValidation, adminRoleValidation], (req, res) => {
    let id = req.params.id

    CategoriaModel.findByIdAndRemove(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    err,
                    message: 'El id ingresado no existe en DB'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoría Eliminada',
            categoria
        })



    })

})

module.exports = app