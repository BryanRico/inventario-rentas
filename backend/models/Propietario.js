const mongoose = require('mongoose');

const propietarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellidoP: { type: String, required: true },
    apellidoM: { type: String, required: true },
    email: { type: String, unique: true },
    activo: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Propietario', propietarioSchema);