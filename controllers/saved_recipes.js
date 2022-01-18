const User = require("../models/User");

exports.list = async (req, res) => {
    try {
      const userRef = await User.findOne({"_id": user.id}).populate('saved_recipes');
      res.render('favorite_recipes', {recipes: userRef.saved_recipes});
    } catch (e) {
      console.log(e);
      res.json({result: 'could not find user favorites'});
    }
}

