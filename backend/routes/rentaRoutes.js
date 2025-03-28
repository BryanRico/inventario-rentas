const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Renta = require('../models/Renta');
//const Usuario = require('../models/Usuario'); // Se cambia Empleado por Operador
const verificarToken = require('../middleware/verificarToken');
const autorizarRol = require('../middleware/autorizarRol');
const winston = require('winston');
const Usuario = require('../models/Usuario');

// Configurar logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
    ]
});

// Ruta para registrar una nueva renta
router.post('/', verificarToken, autorizarRol(['admin']), async (req, res) => {
    try {
        const { cliente, proyecto, equipo, fechaInicio, fechaFin, diasFilmacion, porSemana, diasCobradosPorSemana, numeroSemanas, transporte, personal, iva, leyenda, leyendaAcuerdo } = req.body;

        if (!cliente || !proyecto || !equipo || equipo.length === 0 || !fechaInicio || !fechaFin || !diasFilmacion) {
            return res.status(400).json({ error: 'Todos los campos obligatorios deben ser llenados' });
        }

        // Calcular subtotal
        let subtotal = equipo.reduce((acc, item) => {
            const descuento = item.precioUnitario * (item.porcentajeDescuento / 100);
            return acc + (item.precioUnitario - descuento) * item.cantidad;
        }, 0);
        
        transporte.forEach(t => { subtotal += t.costo; });
        personal.forEach(p => { subtotal += p.costo; });
        
        // Aplicar iva si es true
        const total = iva ? subtotal * 1.16 : subtotal;

        // Crear nueva renta
        const nuevaRenta = new Renta({
            cliente, proyecto, equipo, fechaInicio, fechaFin, diasFilmacion, porSemana, diasCobradosPorSemana, numeroSemanas, transporte, personal: personal.map(({ costo }) => ({ costo })), subtotal, iva, total, leyenda, leyendaAcuerdo, estado: 'pendiente'
        });
        
        await nuevaRenta.save();
        logger.info(`Nueva renta registrada para el proyecto: ${proyecto}`);
        res.status(201).json(nuevaRenta);
    } catch (error) {
        logger.error('Error al registrar renta:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta para editar una renta antes de ser aceptada
router.put('/:id', verificarToken, autorizarRol(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const renta = await Renta.findById(id);

        if (!renta) {
            return res.status(404).json({ error: 'Renta no encontrada' });
        }

        if (renta.estado !== 'pendiente') {
            return res.status(400).json({ error: 'Solo se pueden editar rentas en estado pendiente' });
        }

        // Actualizar datos
        Object.assign(renta, req.body);
        await renta.save();

        logger.info(`Renta ${id} editada correctamente`);
        res.status(200).json(renta);
    } catch (error) {
        logger.error('Error al editar renta:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});


// Ruta para cambiar el estado de una renta
router.patch('/:id/estado', verificarToken, autorizarRol(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const renta = await Renta.findById(id);
        if (!renta) {
            return res.status(404).json({ error: 'Renta no encontrada' });
        }

        if (renta.estado === 'aceptada' && estado !== 'cancelada') {
            return res.status(400).json({ error: 'Solo se puede cambiar el estado a cancelada después de ser aceptada' });
        }

        renta.estado = estado;
        await renta.save();
        logger.info(`Estado de renta ${id} cambiado a ${estado}`);
        res.status(200).json(renta);
    } catch (error) {
        logger.error('Error al cambiar estado de renta:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});


// Ruta para generar el presupuesto en PDF
router.get('/:id/presupuesto', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const renta = await Renta.findById(id);

        if (!renta) {
            return res.status(404).json({ error: 'Renta no encontrada' });
        }

        const doc = new PDFDocument();
        res.setHeader('Content-Disposition', `attachment; filename=presupuesto_${id}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);
        
        doc.fontSize(18).text('Presupuesto de Renta', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Cliente: ${renta.cliente}`);
        doc.text(`Proyecto: ${renta.proyecto}`);
        doc.text(`Fecha de Inicio: ${renta.fechaInicio}`);
        doc.text(`Fecha de Fin: ${renta.fechaFin}`);
        doc.text(`Subtotal: $${renta.subtotal.toFixed(2)}`);
        doc.text(`IVA: ${renta.IVA ? 'Sí' : 'No'}`);
        doc.text(`Total: $${renta.total.toFixed(2)}`);
        doc.moveDown();
        doc.text('Equipo Rentado:', { underline: true });
        renta.equipo.forEach(item => {
            doc.text(`- ${item.nombre}: $${item.precioUnitario.toFixed(2)} x ${item.cantidad} unidades`);
        });
        doc.end();
    } catch (error) {
        logger.error('Error al generar presupuesto en PDF:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});


// Ruta para generar el presupuesto en PDF con un diseño mejorado
router.get('/:id/presupuesto', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const renta = await Renta.findById(id);

        if (!renta) {
            return res.status(404).json({ error: 'Renta no encontrada' });
        }

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Disposition', `attachment; filename=presupuesto_${id}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        // Encabezado
        doc.fontSize(20).text('Presupuesto de Renta', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Cliente: ${renta.cliente}`);
        doc.text(`Proyecto: ${renta.proyecto}`);
        doc.text(`Fecha de Inicio: ${renta.fechaInicio}`);
        doc.text(`Fecha de Fin: ${renta.fechaFin}`);
        doc.text(`Subtotal: $${renta.subtotal.toFixed(2)}`);
        doc.text(`IVA: ${renta.IVA ? 'Sí' : 'No'}`);
        doc.text(`Total: $${renta.total.toFixed(2)}`);
        doc.moveDown();

        // Tabla de equipo rentado
        doc.text('Equipo Rentado:', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(10);
        doc.text('Nombre', 50, doc.y, { bold: true });
        doc.text('Cantidad', 200, doc.y, { bold: true });
        doc.text('Precio Unitario', 300, doc.y, { bold: true });
        doc.text('Total', 450, doc.y, { bold: true });
        doc.moveDown(0.5);

        renta.equipo.forEach(item => {
            doc.text(item.nombre, 50, doc.y);
            doc.text(item.cantidad.toString(), 200, doc.y);
            doc.text(`$${item.precioUnitario.toFixed(2)}`, 300, doc.y);
            doc.text(`$${(item.precioUnitario * item.cantidad).toFixed(2)}`, 450, doc.y);
        });
        
        doc.end();
    } catch (error) {
        logger.error('Error al generar presupuesto en PDF:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});


module.exports = router;

