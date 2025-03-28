const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellidoP: { type: String, required: true },
    apellidoM: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    rol: { type: String, enum: ['admin', 'bodega','operador'], default:'operador', required: true },
    disponible: { type: Boolean, default: true },
    activo: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);
