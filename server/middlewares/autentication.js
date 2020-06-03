// ========================================
// TOKEN VALIDATION
// ========================================

const jwt = require('jsonwebtoken')

let tokenValidation = (req, res, next) => {

    // Se obtiene el header con el token
    let token = req.get('Authorization')

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {

            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no válido"
                }
            })
        }

        req.usuario = decoded.usuario
        next()
    })
}

// ========================================
// ADMIN ROLE VALIDATION
// ========================================

let adminRoleValidation = (req, res, next) => {

    let usuario = req.usuario
    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: "Access Denied, only admin role"
            }
        })
    }

    next()


}

// ========================================
// TOKEN VALIDATION FOR IMGS
// ========================================

let verificaTokenImg = (req, res, next) => {
    let token = req.query.token

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {

            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no válido"
                }
            })
        }

        req.usuario = decoded.usuario
        next()
    })
}

module.exports = {
    tokenValidation,
    adminRoleValidation,
    verificaTokenImg
}