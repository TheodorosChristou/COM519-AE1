require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const bartenderController = require("./controllers/bartender");
const cocktailController = require("./controllers/cocktail");
app.set("view engine", "ejs");

/**
 * notice above we are using dotenv. We can now pull the values from our environment
 */

const { PORT, MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log("MongoDB connection error. Please make sure MongoDB is running.");
  process.exit();
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/bartenders", bartenderController.list);
app.get("/bartenders/delete/:id", bartenderController.delete);

app.get("/cocktails", cocktailController.list);
app.get("/cocktails/delete/:id", cocktailController.delete);

app.listen(PORT, () => {
  console.log(`Example app listening to http://localhost:${PORT}`);
});
