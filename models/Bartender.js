const mongoose = require("mongoose");
const { Schema } = mongoose;

const bartenderSchema = new Schema(
  {
    recipies: { type: Number, default: 0 },
    Location: String,
    Bar_Company: String,
    name: { type: String, required: [true, 'Name is required'], minlength: [3, "Name must be 4 chars long"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bartender", bartenderSchema);
