const express = require('express');
const router = express.Router();
const Inventario = require('../models/Inventario');
const verificarToken = require('../middleware/verificarToken');
const autorizarRol = require('../middleware/autorizarRol');
const winston = require('winston');


// Configurar logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/inventario.log', level: 'info' })
    ]
});

// Obtener todos los elementos del inventario
router.get('/', async (req, res) => {
    try {
        const items = await Inventario.find();
        res.json(items);
    } catch (err) {
        logger.error('Error obteniendo inventario', { error: err.message });
        res.status(500).json({ error: 'Error obteniendo inventario' });
    }
});

// Obtener un elemento por ID
router.get('/:id', async (req, res) => {
    try {
        const item = await Inventario.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Artículo no encontrado' });
        res.json(item);
    } catch (err) {
        logger.error('Error obteniendo artículo', { error: err.message });
        res.status(500).json({ error: 'Error obteniendo artículo' });
    }
});

// Crear un nuevo elemento en el inventario
router.post('/', async (req, res) => {
    try {
        const newItem = new Inventario(req.body);
        await newItem.save();
        logger.info('Artículo creado', { id: newItem._id });
        res.status(201).json(newItem);
    } catch (err) {
        logger.error('Error creando artículo', { error: err.message });
        res.status(500).json({ error: 'Error creando artículo' });
    }
});

// Actualizar un artículo
router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await Inventario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) return res.status(404).json({ error: 'Artículo no encontrado' });
        logger.info('Artículo actualizado', { id: updatedItem._id });
        res.json(updatedItem);
    } catch (err) {
        logger.error('Error actualizando artículo', { error: err.message });
        res.status(500).json({ error: 'Error actualizando artículo' });
    }
});

// Eliminar un artículo
router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Inventario.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ error: 'Artículo no encontrado' });
        logger.info('Artículo eliminado', { id: deletedItem._id });
        res.json({ message: 'Artículo eliminado' });
    } catch (err) {
        logger.error('Error eliminando artículo', { error: err.message });
        res.status(500).json({ error: 'Error eliminando artículo' });
    }
});


router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { disponible } = req.body;

        if (disponible === undefined) {
            logger.warn(`⚠️  Solicitud inválida: falta el campo 'disponible'`);
            return res.status(400).json({ error: "El campo 'disponible' es requerido" });
        }

        const articulo = await Inventario.findByIdAndUpdate(id, { disponible }, { new: true });

        if (!articulo) {
            logger.warn(`❌ Artículo con ID ${id} no encontrado`);
            return res.status(404).json({ error: "Artículo no encontrado" });
        }

        logger.info(`✅ Artículo con ID ${id} actualizado a disponible: ${disponible}`);
        res.json({ mensaje: "Artículo actualizado correctamente", articulo });
    } catch (error) {
        logger.error(`🔥 Error en la actualización del artículo: ${error.message}`, { stack: error.stack });
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// Nueva ruta para manejar accesorios
router.patch('/inventario/:id/accesorios', verificarToken, autorizarRol(['admin', 'bodega']), async (req, res) => {
    try {
        const { accesorios } = req.body;
        if (!Array.isArray(accesorios)) {
            return res.status(400).json({ error: 'Accesorios debe ser un array de IDs' });
        }
        const inventario = await Inventario.findByIdAndUpdate(req.params.id, { accesorios }, { new: true });
        if (!inventario) {
            return res.status(404).json({ error: 'Artículo no encontrado' });
        }
        logger.info(`Accesorios de ${inventario.nombre} actualizados`);
        res.json(inventario);
    } catch (error) {
        logger.error('Error al actualizar accesorios:', error);
        res.status(500).json({ error: 'Error al actualizar accesorios' });
    }
});

// Nueva ruta para manejar propietarios
router.patch('/inventario/:id/propietarios', verificarToken, autorizarRol(['admin']), async (req, res) => {
    try {
        const { propietarios } = req.body;
        if (!Array.isArray(propietarios)) {
            return res.status(400).json({ error: 'Propietarios debe ser un array de IDs' });
        }
        const inventario = await Inventario.findByIdAndUpdate(req.params.id, { propietarios }, { new: true });
        if (!inventario) {
            return res.status(404).json({ error: 'Artículo no encontrado' });
        }
        logger.info(`Propietarios de ${inventario.nombre} actualizados`);
        res.json(inventario);
    } catch (error) {
        logger.error('Error al actualizar propietarios:', error);
        res.status(500).json({ error: 'Error al actualizar propietarios' });
    }
});


// Nueva ruta para búsqueda y filtrado avanzado
router.get('/inventario/busqueda', verificarToken, async (req, res) => {
    try {
        const filtros = req.query;
        const query = {};
        
        if (filtros.nombre) query.nombre = { $regex: filtros.nombre, $options: 'i' };
        if (filtros.categoria) query.categoria = filtros.categoria;
        if (filtros.subcategoria) query.subcategoria = filtros.subcategoria;
        if (filtros.propietarios) query.propietarios = { $in: filtros.propietarios.split(',') };
        if (filtros.disponible) query.disponible = filtros.disponible === 'true';
        if (filtros.marca) query.marca = filtros.marca;

        const resultados = await Inventario.find(query);
        res.json(resultados);
    } catch (error) {
        logger.error('Error en la búsqueda de inventario:', error);
        res.status(500).json({ error: 'Error en la búsqueda' });
    }
});

module.exports = router;
