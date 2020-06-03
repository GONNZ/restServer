const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const UserModel = require('../models/usuario')
const ProductModel = require('../models/productos')

const fs = require('fs')
const path = require('path')

app.use(fileUpload({ useTempFiles: true }));


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo
    let id = req.params.id

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "No se ha enviado ningún archivo"
            }
        })
    }

    //Validar el tipo 
    let tiposValidos = ['productos', 'usuarios']

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El tipo del archivo no es válido, los perimitidos son: ' + tiposValidos.join(', '),
                tipoEnviado: tipo
            }
        })
    }

    let archivo = req.files.archivo
    let nombreExtension = archivo.name.split('.')
    let extension = nombreExtension[nombreExtension.length - 1]

    // Extensiones permitidas
    let extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg']


    if (extensionesPermitidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'La extensión del archivo no es válida las perimitidas son: ' + extensionesPermitidas.join(', '),
                extEnviada: extension
            }
        })
    }

    //Modificar el nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo)
        } else {
            imagenProducto(id, res, nombreArchivo)
        }



    })
})

// =============================
// Funciones
// =============================

function imagenUsuario(id, res, nombreArchivo) {

    UserModel.findById(id, (err, usuario) => {

        if (err) {

            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuario) {
            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        borraArchivo(usuario.img, 'usuarios')

        usuario.img = nombreArchivo

        usuario.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo

            })
        })
    })

}

function imagenProducto(id, res, nombreArchivo) {
    ProductModel.findById(id, (err, product) => {
        if (err) {

            borraArchivo(nombreArchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!product) {
            borraArchivo(nombreArchivo, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }

        borraArchivo(product.img, 'productos')

        product.img = nombreArchivo

        product.save((err, productGuardado) => {
            res.json({
                ok: true,
                usuario: productGuardado,
                img: nombreArchivo

            })
        })

    })
}

function borraArchivo(nombreImg, tipo) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`)

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg)
    }
}

module.exports = app