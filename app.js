require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const bartenderController = require("./controllers/bartender");
const cocktailController = require("./controllers/cocktail");
const cocktailApiController = require("./controllers/api/cocktail");
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/search-recipe", (req, res) => {
  res.render("search-recipe");
});

app.get("/api/search-recipe", cocktailApiController.list);

app.get("/bartenders", bartenderController.list);
app.get("/bartenders/delete/:id", bartenderController.delete);
app.get("/bartenders/update/:id", bartenderController.edit);
app.post("/bartenders/update/:id", bartenderController.update);

app.get("/cocktails", cocktailController.list);
app.get("/cocktails/delete/:id", cocktailController.delete);

app.get("/create-bartender", (req, res) => {
  res.render("create-bartender", { errors: {} });
});

app.post("/create-bartender", bartenderController.create);

app.get("/create-cocktail", cocktailController.createView);
app.post("/create-cocktail", cocktailController.create);
app.get("/cocktails/update/:id", cocktailController.edit);
app.post("/cocktails/update/:id", cocktailController.update);

app.listen(PORT, () => {
  console.log(`Example app listening to http://localhost:${PORT}`);
});
