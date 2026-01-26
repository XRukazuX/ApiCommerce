const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Token requerido" });

  const token = header.split(" ")[1]; // "Bearer TOKEN"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // info del usuario disponible
    next();
  } catch {
    res.status(401).json({ message: "Token inválido" });
  }
}

module.exports = auth;
