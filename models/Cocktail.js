const mongoose = require("mongoose");
const { Schema } = mongoose;

const cocktailSchema = new Schema(
  {
    Cocktail_Name: String,
    Bartender: String,
    Bar_Company: String,
    Location: String,
    Ingredients: String,
    Garnish: String,
    Glassware: String,
    Preparation: String,
    Notes: String,
    Bartender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bartender",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cocktail", cocktailSchema);
