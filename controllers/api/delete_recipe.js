const { render } = require("express/lib/response");
const User = require("../../models/User");

exports.delete = async (req, res) => {
    const recipeId = req.body.id;
    
    if (  !recipeId || req.session.userID) {
      res.json({result: 'error'});
    }
    try {
      await User.update({"_id": req.session.userID}, {$pull:{saved_recipes: recipeId}})
    } catch (e) {
      res.status(404).send({
        message: `could not delete favorite.`,
      });
    }
  };