const Cocktail = require("../models/Cocktail");

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
  try {
    await Cocktail.findByIdAndRemove(id);
    res.redirect("/Cocktails");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};
