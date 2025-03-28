// Importar módulos necesarios
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const winston = require('winston');
const verificarToken = require('./middleware/verificarToken');
const autorizarRol = require('./middleware/autorizarRol');
const restringirOperador = require('./middleware/restringirOperador');
const validarPropietarios = require('./middleware/validarPropietarios');
const actualizarAccesorios = require('./middleware/actualizarAccesorios');
const inventarioRoutes = require('./routes/inventarioRoutes');
const authRoutes = require('./routes/authRoutes');

// Configurar logger con Winston
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

// Inicializar Express
const app = express();
app.use(express.json());
app.use(cors());

// Usar rutas de autenticación
app.use('api/auth', authRoutes);
app.use('/inventario', 
    verificarToken, 
    autorizarRol(['admin', 'bodega', 'operador']), 
    restringirOperador, 
    validarPropietarios,
    actualizarAccesorios,
    inventarioRoutes
);

// Proteger rutas de inventario
//app.use('/inventario', authMiddleware, inventarioRoutes);

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => logger.info('📦 Conectado a MongoDB'))
  .catch(err => {
      logger.error('❌ Error al conectar a MongoDB:', err);
      process.exit(1); // Terminar el proceso si no hay conexión a la base de datos
  });

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API funcionando 🚀');
});

//app.use('/Inventario', authMiddleware, roleMiddleware(['admin', 'operador']), inventarioRoutes, testAutorizacionInventario);
/* Usar rutas del inventario
app.use('/inventario', inventarioRoutes);*/

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    logger.error(err.message, { stack: err.stack });
    res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

// Puerto del servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
