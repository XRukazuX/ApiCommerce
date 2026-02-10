const express = require("express");
const router = express.Router(); //Se lo usa como app en el principal pero despues sera llamado.
const mongoose = require("mongoose"); //se tiene que tener en cuenta que tendras mongoose conectado para que ande
const MiModelo = require("../models/TestUsuario");
// Importar el modelo
const auth = require("../models/authToken.js");

router.get("/product", async (req, res) => {
  try {
    const documentos = await MiModelo.find();

    if (documentos.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay documentos en la colección" });
    }

    // Extraer solo los productos de cada documento
    const productos = documentos.flatMap((doc) => doc.product);

    console.log("Productos encontrados");
    res.status(200).json(productos);
  } catch (err) {
    console.error("Error al obtener productos");
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

router.post("/newproduct", auth, async (req, res) => {
  const { nombre, costo, imagen, descripcion } = req.body;
  try {
    // req.user viene del token
    const email = req.user.email;

    // Buscamos al usuario en la base de datos
    const doc = await MiModelo.findOne();
    const user = doc.user.find((u) => u.email === email);
    if (!user)
      return res.status(404).json({
        message:
          "Usuario no encontrado, no tiene permitido publicar nuevo producto",
      });

    const nuevoProducto = {
      _id: doc.product.length + 1,
      nombre,
      costo,
      descripcion,
      imagen,
    };

    // Agregar el producto al arreglo 'product' del documento de usuario
    doc.product.push(nuevoProducto);

    // Guardar el documento actualizado
    await doc.save();

    res.status(200).json({
      message: "Producto agregado exitosamente",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener agregar producto" });
  }
});
module.exports = router;

//Anda route
