require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
app.set("view engine", "ejs");

/**
 * notice above we are using dotenv. We can now pull the values from our environment
 */

const { PORT } = process.env;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/tasters", (req, res) => {
  res.render("tasters");
});

app.listen(PORT, () => {
  console.log(`Example app listening to http://localhost:${PORT}`);
});
