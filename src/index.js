const express = require("express");
const app = express();
const con = require("./db/app");
const path = require("path");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const staticPath = path.join(__dirname, "../public");
app.use(express.static(staticPath));

app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/table", (req, res) => {
  res.render("table");
});

app.post("/register", (req, res) => {
  const { id, name, city, age } = req.body;
  console.log("Received data:", { id, name, city, age });

  con.connect(function (err) {
    if (err) throw err;

    const sql = `INSERT INTO student (id, name, city, age) VALUES (${id}, '${name}', '${city}', ${age})`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      console.log(`${id} record inserted`);
      // res.send("Data inserted successfully");
      res.redirect("/dataset");
    });
  });
});

app.get("/dataset", (req, res) => {
  con.connect(function (err) {
    if (err) throw err;
    var sql = "SELECT * FROM student";
    con.query(sql, function (err, result) {
      if (err) throw err;
      // console.log(result);
      res.render("table", { student: result });
    });
  });
});

app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  con.connect(function (err) {
    if (err) throw err;
    const sql = `DELETE FROM student WHERE id = ${id}`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      // console.log(`${id} record deleted`);
      res.redirect("/dataset");
    });
  });
});

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  con.connect(function (err) {
    if (err) throw err;
    const sql = `SELECT * FROM student WHERE id = ${id}`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      else {
        // console.log(`${id} record fetched`);
        res.render("update", { student: result });
      }
    });
  });
});

app.post("/edit/:id", (req, res) => {
  var id = req.params.id;
  var { name, city, age } = req.body;
  id = req.body.id;
  // console.log("Received data:", { id, name, city, age });
  con.connect(function (err) {
    if (err) throw err;
    const sql = `UPDATE student SET name = '${name}', city = '${city}', age = ${age} WHERE id = ${id}`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      // console.log(`${id} record inserted`);
      // res.send("Data inserted successfully");
      res.redirect("/dataset");
    });
  });
});

app.get("/search", (req, res) => {
  con.connect(function (err) {
    if (err) throw err;
    var sql = "SELECT * FROM student";
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.render("search", { student: result });
    });
  });
});

app.get("/searched", (req, res) => {
  var name = req.query.name;
  var city = req.query.city;
  var age = req.query.age;
  con.connect(function (err) {
    if (err) throw err;
    var sql = `SELECT * FROM student WHERE name LIKE '%${name}%' AND city LIKE '%${city}%' AND age LIKE '%${age}%'`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.render("search", { student: result });
    });
  });
});

app.listen(3000, () => {
  console.log("server is running at 3000");
});
