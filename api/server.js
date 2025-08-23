// api/server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");



const app = express();
app.use(cors());
app.use(bodyParser.json());

// ⚡ conexión a MySQL (usa conexiones por request, no pool global grande en serverless)
function getDB() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
  });
}

// Rutas API
app.get("/api/pagos", (req, res) => {
  const db = getDB();
  db.query("SELECT * FROM pagos", (err, results) => {
    db.end();
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/api/pagos", (req, res) => {
  const { id, nombre, precio, mes, pagado } = req.body;
  const db = getDB();
  db.query(
    "INSERT INTO pagos (id, nombre, precio, mes, pagado) VALUES (?, ?, ?, ?, ?)",
    [id, nombre, precio, mes, pagado],
    (err) => {
      db.end();
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

app.put("/api/pagos/:id", (req, res) => {
  const { nombre, precio, mes, pagado } = req.body;
  const db = getDB();
  db.query(
    "UPDATE pagos SET nombre=?, precio=?, mes=?, pagado=? WHERE id=?",
    [nombre, precio, mes, pagado, req.params.id],
    (err) => {
      db.end();
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

app.delete("/api/pagos/:id", (req, res) => {
  const db = getDB();
  db.query("DELETE FROM pagos WHERE id=?", [req.params.id], (err) => {
    db.end();
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
});

// 🚀 Exportar como serverless function
module.exports = app;
