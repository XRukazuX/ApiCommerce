//Dependencias usadas
const express = require("express");
const cors = require("cors");
const app = express();
const auth = require("./models/authToken"); //Autorizacion que se da al comparar el token.se coloca como seguro de las rutas
const mongoose = require("mongoose");
require("dotenv").config();

//Variables dependientes de .env
const Port = process.env.PORT || 5000;
const MongoKei = process.env.MONGO || "";

// Middlewares
mongoose
  .connect(MongoKei)
  .then(async () => {
    console.log("Mongodb Conectado"); // Se imprime si la conexión está bien
  })
  .catch((err) => console.log("Error de conexion: ", err)); //Verifica que este conectado mongoose una vez conectado podemos decir que podemos manipular el documento de Test-user

app.use(cors()); // permite que frontend haga requests
app.use(express.json()); // para recibir JSON
app.use(express.urlencoded({ extended: true })); // para recibir formularios HTML

//Routes
app.get("/", (req, res) => res.json({ messaje: "conectado a la api" }));
const productRoute = require("./routes/productRoutes");
app.use("/api", productRoute);
const userRoute = require("./routes/authRoutes");
app.use("/api", userRoute);
const loginTokenRoute = require("./routes/loginRoute");
app.use("/api", loginTokenRoute);
const dateLogin = require("./routes/profileRoute");
app.use("/api", dateLogin);
const cartRoute = require("./routes/cartRoute");
app.use("/api", cartRoute);
app.listen(Port, () =>
  console.log(`Servidor corriendo en el puerto : ${Port}`),
);
