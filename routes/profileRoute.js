const express = require("express");
const router = express.Router();
const MiModelo = require("../models/TestUsuario.js");
const auth = require("../models/authToken.js");

router.get("/profile", auth, async (req, res) => {
  try {
    // req.user viene del token
    const email = req.user.email;

    // Buscamos al usuario en la base de datos
    const doc = await MiModelo.findOne();
    const user = doc.user.find((u) => u.email === email);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Convertimos a objeto plano y eliminamos la contraseña
    const userData = { ...user.toObject() };
    delete userData.password;

    res.json({ user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener datos del usuario" });
  }
});

module.exports = router;
