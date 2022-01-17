const Bartender = require("../models/Bartender");

exports.list = async (req, res) => {
  try {
    const bartenders = await Bartender.find({});
    res.render("bartenders", { bartenders: bartenders });
  } catch (e) {
    res.status(404).send({ message: "could not list bartenders" });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Bartender.findByIdAndRemove(id);
    count = 0;
    res.redirect("/bartenders");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};

exports.create = async (req, res) => {

  try {
    const bartender = new Bartender({ name: req.body.name, Bar_Company: req.body.Bar_Company, Location: req.body.Location });
    await bartender.save();
    res.redirect('/bartenders')
  } catch (e) {
    if (e.errors) {
      console.log(e.errors);
      res.render('create-bartender', { errors: e.errors })
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
    const bartender = await Bartender.findById(id);
    res.render('update-bartender', { bartender: bartender, id: id });
  } catch (e) {
    res.status(404).send({
      message: `could not find bartender ${id}.`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const bartender = await Bartender.updateOne({ _id: id }, req.body);
    res.redirect('/bartenders');
  } catch (e) {
    res.status(404).send({
      message: `could not find bartender ${id}.`,
    });
  }
};