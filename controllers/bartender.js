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
    res.redirect("/bartenders");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};