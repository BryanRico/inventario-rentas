const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro";

// Ruta para registrar usuarios (solo se registran como "operador" por defecto)
router.post("/registro", async (req, res) => {
  try {
    const { nombre, apellidoP, apellidoM, email, contraseña } = req.body;

    if (!nombre || !apellidoP || apellidoM || !email || !contraseña) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear nuevo usuario con rol "operador" por defecto
    const nuevoUsuario = new Usuario({
      nombre,
      apellidoP,
      apellidoM,
      email,
      contraseña: hashedPassword,
      rol: "operador", // Se asigna por defecto
    });

    await nuevoUsuario.save();

    // Generar un token de acceso
    const token = jwt.sign({ id: nuevoUsuario._id, rol: nuevoUsuario.rol }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ message: "Usuario registrado correctamente", token });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Ruta para iniciar sesión
router.post("/login", async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    const validPassword = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!validPassword) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    // Generar token
    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Inicio de sesión exitoso", token, usuario });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
