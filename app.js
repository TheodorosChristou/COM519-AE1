require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const bartenderController = require("./controllers/bartender");
const cocktailController = require("./controllers/cocktail");
const cocktailApiController = require("./controllers/api/cocktail");
const savedRecipeApiController = require("./controllers/api/saved_recipes");
const deleteRecipeApiController = require("./controllers/api/delete_saved_recipes");
const savedRecipeController = require("./controllers/saved_recipes");
const expressSession = require("express-session");
const User = require("./models/User");
const userController = require("./controllers/user");
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

global.count = 0;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({ secret: 'foo barr', cookie: { expires: new Date(253402300000000) } }))

global.user = false;
app.use("*", async (req, res, next) => {
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
})

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
}

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/search-recipe", (req, res) => {
  res.render("search-recipe");
});

app.get("/search-recipe-favorite", (req, res) => {
  res.render("search-recipe-favorite");
});

app.get("/api/search-recipe", cocktailApiController.list);

app.get("/bartenders", bartenderController.list);
app.get("/bartenders/delete/:id", bartenderController.delete);
app.get("/bartenders/update/:id", bartenderController.edit);
app.post("/bartenders/update/:id", bartenderController.update);

app.get("/cocktails", cocktailController.list);
app.get("/cocktails/delete/:id", cocktailController.delete);

app.get("/create-bartender",authMiddleware, (req, res) => {
  res.render("create-bartender", { errors: {} });
});

app.post("/create-bartender", bartenderController.create);

app.get("/create-cocktail", cocktailController.createView);
app.post("/create-cocktail", cocktailController.create);
app.get("/cocktails/update/:id", cocktailController.edit);
app.post("/cocktails/update/:id", cocktailController.update);

app.get("/register", (req, res) => {
  res.render('register-user', { errors: {} })
});

app.post("/register", userController.create);
app.get("/login", (req, res) => {
  res.render('login-user', { errors: {} })
});
app.post("/login", userController.login);

app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
})

app.get("/favorite_recipes", savedRecipeController.list);

app.post("/api/saved_recipes", savedRecipeApiController.create);

app.listen(PORT, () => {
  console.log(`Example app listening to http://localhost:${PORT}`);
});
