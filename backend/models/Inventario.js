const mongoose = require('mongoose');

const InventarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String },
    categoria: { type: String, required: true },
    subcategoria: { type: String },
    marca: { type: String },
    modelo: { type: String },
    numeroSerie: { type: String, unique: true },
    precioRenta: { type: Number, required: true },
    valorEquipo: { type: Number, required: true },
    cantidad: { type: Number, default: 1 },
    existente: { type: Boolean, default: true },
    disponible: { type: Boolean, default: true },
    codigo:{type: String, unique:true},
    identificador:{type: String, unique:true},
    estado: { type: String, enum: ['Funcional', 'Averiado', 'En reparación'], default: 'Funcional' },
    observaciones: { type: String },
    accesorios: [{ 
        nombre: { type: String },
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventario' }
    }],
    propietarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
    imagen: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Inventario', InventarioSchema);
