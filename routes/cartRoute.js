const express = require("express");
const router = express.Router();
const MiModelo = require("../models/TestUsuario.js");
const auth = require("../models/authToken.js");
const { route } = require("./profileRoute.js");

// Guardar carrito final
router.post("/cart", auth, async (req, res) => {
  try {
    const { cart } = req.body; // array completo desde frontend
    const doc = await MiModelo.findOne();
    const user = doc.user.find((u) => u.email === req.user.email);

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    user.cart = cart; // reemplazamos todo el carrito
    await doc.save();

    res.json({ message: "Carrito guardado", cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al guardar carrito" });
  }
});
router.get("/cart", auth, async (req, res) => {
  try {
    const doc = await MiModelo.findOne();
    const user = doc.user.find((u) => u.email === req.user.email);

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    return res.json({ cart: user.cart || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener carrito" });
  }
});

// Vaciar carrito
router.delete("/cart", auth, async (req, res) => {
  try {
    const doc = await MiModelo.findOne();
    const user = doc.user.find((u) => u.email === req.user.email);

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    user.cart = []; // vaciamos carrito
    await doc.save();

    res.json({ message: "Carrito vaciado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al vaciar carrito" });
  }
});

module.exports = router;
