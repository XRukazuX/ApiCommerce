const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ProductSchema = new mongoose.Schema({
  nombre: String,
  costo: Number,
  _id: Number,
  imagen: String,
  descripcion: Array,
});

const UserDataSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cart: { type: Array, default: [] },
});

const TestUsuarioSchema = new mongoose.Schema({
  user: { type: [UserDataSchema], default: [] },
  product: { type: [ProductSchema], default: [] }, //Esquema de lo recibiria de mongoose
});

// hash password
TestUsuarioSchema.pre("save", async function () {
  if (!this.user || this.user.length === 0) return;

  for (let i = 0; i < this.user.length; i++) {
    const user = this.user[i];
    // Si el password ya empieza con $2b$10$, asumimos que ya es hash
    if (user.password.startsWith("$2b$10$")) continue;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

const MiModelo = mongoose.model(
  "Test-Usuarios",
  TestUsuarioSchema,
  "Test-Usuarios",
); //Tener en cuenta que se nombra la coleccion osea el documento.Modelo del documento a pedir de la coleccion.
module.exports = MiModelo;
