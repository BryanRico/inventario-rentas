const mongoose = require('mongoose');

const RentaSchema = new mongoose.Schema({
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    proyecto: { type: String, required: true },
    equipo: [
        {
            nombre: { type: String, required: true },
            cantidad: { type: Number, required: true },
            precioUnitario: { type: Number, required: true },
            porcentajeDescuento: { type: Number, default: 0 },
            subtotal: { type: Number, required: true }
        }
    ],
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    diasFilmacion: { type: Number, required: true },
    porSemana: { type: Boolean, default: false },
    diasCobradosPorSemana: { type: Number, default: 0 }, 
    numeroSemanas: { type: Number, default: 0 },  // NUEVA PROPIEDAD
    transporte: [
        {
            tipo: { type: String, required: true },
            costo: { type: Number, required: true }
        }
    ],
    personal: [
        {
            puesto: { type: String, required: true },            
            costo: { type: Number, required: true },
            horasExtra: { type: Boolean, default: true }
        }
    ],
    subtotal: { type: Number, required: true },
    iva: { type: Boolean, required: true },
    total: { type: Number, required: true },
    leyenda: { type: String, default: '' },
    leyendaAcuerdo: { type: String, default: '' },
    estado: { type: String, enum: ['pendiente', 'aceptado', 'cancelado'], default: 'pendiente' }
}, { timestamps: true });

// Validación para garantizar que "diasCobradosPorSemana" y "numeroSemanas" solo se usen si "porSemana" es true
RentaSchema.pre('save', function (next) {
    if (!this.porSemana) {
        this.diasCobradosPorSemana = 0;
        this.numeroSemanas = 0;
    }
    next();
});

module.exports = mongoose.model('Renta', RentaSchema);
