const express = require("express");
const router = express.Router(); //Se lo usa como app en el principal pero despues sera llamado.
const mongoose = require("mongoose"); //se tiene que tener en cuenta que tendras mongoose conectado para que ande
const MiModelo = require("../models/TestUsuario");
// Importar el modelo

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

module.exports = router;

//Anda route
