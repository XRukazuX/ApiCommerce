const express = require("express");
const router = express.Router();
const MiModelo = require("../models/TestUsuario.js");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }
    // Buscar documento central
    let doc = await MiModelo.find(); // .exec() ayuda a que Mongoose devuelva una Promise real
    if (!doc) {
      res.status(404).json({ mensaje: "No se encuentran documentos" });
    } else console.log(doc);

    // Verificar si el usuario ya existe
    const existingUser = doc[0].user.find((u) => u.email === email);
    if (existingUser)
      return res.status(400).json({ message: "Usuario ya registrado" });

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Agregar usuario al array
    const newUser = { username, email, password: hashedPassword, cart: [] };
    doc[0].user.push(newUser);
    await doc[0].save(); // guardar cambios

    res
      .status(201)
      .json({ message: "Usuario registrado correctamente", user: newUser });
  } catch (err) {
    console.error("Error en /register:", err);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
});

module.exports = router;
