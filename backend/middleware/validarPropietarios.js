const validarPropietarios = (req, res, next) => {
    if (req.body.propietarios && !Array.isArray(req.body.propietarios)) {
        return res.status(400).json({ error: 'Propietarios debe ser un array de IDs' });
    }
    next();
};

module.exports = validarPropietarios;