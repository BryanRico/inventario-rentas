const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const tokenLimpio = token.replace('Bearer ', '');
        const decoded = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
        req.user = decoded; // Agrega los datos del usuario al objeto `req`
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};

module.exports = verificarToken;
