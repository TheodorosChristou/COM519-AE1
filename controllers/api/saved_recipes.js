const User = require("../../models/User");
exports.create = async (req, res) => {
      const recipeId = req.body.id;
      if (  !recipeId || req.session.userID) {
        res.json({result: 'error'});
      }
      try {
        await User.updateOne({"_id": req.session.userID}, {$push:{saved_recipes: recipeId}})
      } catch (e) {
        res.json({result: 'error could not create a favourite'});
      }
  }


    