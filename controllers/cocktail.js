const Cocktail = require("../models/Cocktail");
const Glassware = require("../models/Glassware");
const Bartender = require("../models/Bartender")

exports.list = async (req, res) => {
  const perPage = 10;
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;



  try {
    const cocktails = await Cocktail.find({}).skip((perPage * page) - perPage).limit(limit);
    const count = await Cocktail.find({}).count();
    const numberOfPages = Math.ceil(count / perPage);

    res.render("cocktails", {
        cocktails: cocktails,
      numberOfPages: numberOfPages,
      currentPage: page
    });
  } catch (e) {
    console.log(e);
    res.status(404).send({ message: "could not list cocktails" });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  const bartender = await Cocktail.findById(id);
  const bartender_name = bartender.Bartender_id
  const bartender_update = await Bartender.findById(bartender_name);
  try {
    await Cocktail.findByIdAndRemove(id);
    await Bartender.updateOne({ name : bartender_update.name},
      [{ $set: {recipies: bartender_update.recipies -1}}]
    );

    res.redirect("/Cocktails");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};

exports.createView = async (req, res) => {
  try {
    const bartenders = await Bartender.find({});
    const glasswares = await Glassware.find({});
    res.render("create-cocktail", {
      bartenders: bartenders,
      glasswares: glasswares,
      errors: {}
    });

  } catch (e) {
    res.status(404).send({
      message: `could not generate create data`,
    });
  }
}

exports.create = async (req, res) => {
  try {

    const bartender = await Bartender.findById(req.body.bartender_id);

    await Cocktail.create({
      Cocktail_Name: req.body.Cocktail_Name,
      Bartender: bartender.name,
      Bar_Company: Bartender.Bar_Company,
      Location: Bartender.Location,
      Ingredients: req.body.Ingredients,
      Garnish: req.body.Garnish,
      Glassware: req.body.Glassware,
      Preparation: req.body.Preparation,
      Notes: req.body.Notes,
      Bartender_id: req.body.bartender_id,
    })

    await Bartender.updateOne({ name : bartender.name},
      [{ $set: {recipies: bartender.recipies +1}}]
    );



    res.redirect('/cocktails')
  } catch (e) {
    if (e.errors) {
      res.render('create-cocktail', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
}

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const cocktail = await Cocktail.findById(id);
    const bartender_id = await Cocktail.findById(cocktail.Bartender_id)
    const bartender = await Bartender.findById(bartender_id);
    const glasswares = await Glassware.find({});
    if (!cocktail) throw Error('cant find cocktail');
    res.render('update-cocktail', {
      Cocktail_Name: cocktail,
      bartender: bartender,
      glasswares: glasswares,
      cocktail_name: cocktail.Cocktail_Name,
      cocktail_ing: cocktail.Ingredients,
      cocktail_garnish: cocktail.Garnish,
      cocktail_prep: cocktail.Preparation,
      cocktail_notes: cocktail.Notes,
      id: id,
      errors: {}
    });
  } catch (e) {
    console.log(e)
    if (e.errors) {
      res.render('update-cocktail', { errors: e.errors })
      return;
    }
    res.status(404).send({
      message: `could not find cocktail ${id}`,
    });
  }
};


exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const cocktail = await Cocktail.updateOne({ _id: id }, req.body);
    res.redirect('/cocktails');
  } catch (e) {
    res.status(404).send({
      message: `could find cocktail ${id}.`,
    });
  }
};