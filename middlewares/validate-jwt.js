const { checkJWT } = require('../helpers/jwt');

const validateJWT = (req, res, next) => {
    // Leer token
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    const [valid, uid] = checkJWT(token);
    if(!valid){
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    req.uid = uid;
    next();
}

module.exports = {validateJWT};
