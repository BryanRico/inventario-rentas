const actualizarAccesorios = async (req, res, next) => {
    try {
        if (req.body.disponible !== undefined) {
            const inventario = await Inventario.findById(req.params.id);
            if (!inventario) {
                return res.status(404).json({ error: 'Artículo no encontrado' });
            }
            await Inventario.updateMany(
                { _id: { $in: inventario.accesorios.map(a => a.id) } },
                { disponible: req.body.disponible }
            );
            logger.info(`Accesorios de ${inventario.nombre} actualizados a disponible: ${req.body.disponible}`);
        }
        next();
    } catch (error) {
        logger.error('Error al actualizar accesorios:', error);
        res.status(500).json({ error: 'Error al actualizar accesorios' });
    }
};

module.exports = actualizarAccesorios;