const express = require('express')
const ProductModel = require('../models/productos')
const CategoriaModel = require('../models/categoria')
const { tokenValidation, adminRoleValidation } = require('../middlewares/autentication')
const app = express()


app.get('/productos', [tokenValidation], (req, res) => {

    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)


    ProductModel.find({ disponible: true })
        .sort('nombre')
        .skip(desde)
        .skip(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            ProductModel.countDocuments({}, (err, conteo) => {

                res.json({
                    ok: true,
                    producto,
                    cantidad: conteo
                })

            })

        })

})



app.get('/productos/:id', [tokenValidation], (req, res) => {

    let id = req.params.id
    let body = req.body


    ProductModel.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, producto) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!producto) {
                return res.status(402).json({
                    ok: false,
                    err: {
                        message: 'No existe un producto para el id indicado'
                    }
                })
            }

            res.json({
                ok: true,
                producto,
            })


        })

})

//Buscar productos

app.get('/productos/buscar/:termino', tokenValidation, (req, res) => {

    let termino = req.params.termino
    let regex = new RegExp(termino, 'i')

    ProductModel.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                usuario: productos
            })

        })
})


app.put('/productos/:id/:categoria', [tokenValidation, adminRoleValidation], function(req, res) {


    let id = req.params.id
    let categoria = req.params.categoria
    let body = req.body

    //Validamos categoria en bd
    CategoriaModel.findById(categoria, (err, categoria) => {

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


        let data = {
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            disponible: body.disponible,
            categoria: categoria._id
        }


        ProductModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        }, (err, producto) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!producto) {
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
                producto
            })

        })
    })
})

app.post('/productos/', [tokenValidation, adminRoleValidation], (req, res) => {


    let body = req.body

    let producto = new ProductModel({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!producto) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto
        })

    })
})



app.delete('/productos/:id', [tokenValidation, adminRoleValidation], (req, res) => {
    let id = req.params.id

    ProductModel.findByIdAndUpdate(id, { disponible: false }, {
        new: true,
        runValidators: true
    }, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!producto) {
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
            message: 'Producto Deshabilitado',
            producto
        })
    })

})




module.exports = app