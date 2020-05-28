const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema

let categoriasSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre debe ser enviado'],
        unique: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }

})
categoriasSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' })
module.exports = mongoose.model('Categorias', categoriasSchema)