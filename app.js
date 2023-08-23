require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to MySQL");
});

app.use(express.json());
app.use(cors());

app.get("/todos", (req, res) => {
  const query = "SELECT * FROM todos";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

app.post("/todos", (req, res) => {
  const { task } = req.body;

  const query = "INSERT INTO todos (task, is_completed) VALUES (?, ?)";

  db.query(query, [task, false], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      console.log(err);
    } else {
      res.json({ id: result.insertId, task });
    }
  });
});

app.delete("/todos", (req, res) => {
  const { task } = req.body;

  const query =
    task == undefined
      ? "DELETE FROM todos"
      : "DELETE FROM todos WHERE id = (?)";

  db.query(query, [task == undefined ? null : task.id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      console.log(err);
    } else {
      res.json({ id: result.insertId, task });
    }
  });
});

app.put("/todos", (req, res) => {
  const { task } = req.body;
  let query = "UPDATE todos SET is_completed = (?) WHERE id=(?)";
  db.query(query, [!task.is_completed, task.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: result.insertId, task: req.body.task });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
