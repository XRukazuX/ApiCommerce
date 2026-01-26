const express = require("express");
const router = express.Router();
const MiModelo = require("../models/TestUsuario.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Traemos el documento central
    const doc = await MiModelo.find();
    if (!doc) return res.status(400).json({ message: "No existe Documento" });

    // Buscamos el usuario en el array
    const user = doc[0].user.find((u) => u.email === email);
    if (!user) return res.status(400).json({ message: "No existe Usuario" });
    // Comparamos contraseña
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log(isMatch);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña erronea" });

    // ✅ Generamos token
    const token = jwt.sign(
      { email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }, // puedes cambiar duración
    );

    // Enviamos token al frontend
    res.json({
      message: "Login exitoso",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en login" });
  }
});

module.exports = router;
