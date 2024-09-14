const express = require("express");
const mysql2 = require("mysql2");
const app = express();
app.use(express.json());
const port = 3000;
const connection = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "#",
  database: "authentication",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database: ", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.get("/students", (req, res) => {
  connection.query("SELECT * FROM api", (err, results) => {
    if (err) {
      console.error("Error fetching students: ", err);
      res.status(500).json({ error: "Error fetching students" });
      return;
    }
    res.json(results);
  });
});

app.get("/students/:id", (req, res) => {
  const { id } = req.params;
  connection.query("SELECT * FROM api WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error fetching student: ", err);
      res.status(500).json({ error: "Error fetching student" });
      return;
    }
    res.json(results);
  });
});

app.post("/students", (req, res) => {
  const { token, name, id, age } = req.body;
  connection.query(
    "INSERT INTO api (token, name, id, age) VALUES (?, ?, ?, ?)",
    [token, name, id, age],
    (err, results) => {
      if (err) {
        console.error("Error inserting student: ", err);
        res.status(500).json({ error: "Error inserting student" });
        return;
      }
      res.json(results);
    }
  );
});

app.patch("/students/:id", (req, res) => {
  const { id } = req.params;
  const { token, name, age } = req.body;
  connection.query(
    "UPDATE api SET token=?, name = ?, age = ? WHERE id = ?",
    [token, name, age, id],
    (err, results) => {
      if (err) {
        console.error("Error updating student: ", err);
        res.status(500).json({ error: "Error updating student" });
        return;
      }
      res.json(results);
    }
  );
});

app.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  connection.query("DELETE from api where id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error deleting student:", err);
      res.status(500).json({ error: "Error deleting student" });
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
