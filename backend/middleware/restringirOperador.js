const restringirOperador = (req, res, next) => {
    if (req.user.rol === 'operador') {
        if (req.method !== 'GET' && (req.method !== 'PATCH' || !('disponible' in req.body))) {
            return res.status(403).json({ error: 'No tienes permiso para realizar esta acción.' });
        }
    }
    next();
};

module.exports = restringirOperador;
