var db = require('../models');

var routeHelpers = {
  ensureLoggedIn: function (req, res, next){
    if (req.session.id !== null && req.session.id !== undefined) {
      return next();
    } else {
      res.redirect('/login');
    }
  };

  ensureCorrectUserPost: function (req, res, next) {
    db.Post.findById(req.params.id, function (err, post){
      if (post.user !== req.session.id) {
        res.redirect('/login');
      } else {
        return next();
      }
    });
  },
  ensureCorrectUserComment: function (req, res, next) {
    db.Comment.findById(req.params.id, function (err, comment){
      if (comment.user !== req.session.id) {
        res.redirect('/login');
      } else {
        return next();
      }
    });
  },

  preventLoginSignup: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      res.redirect('/users/' + req.session.id);
    }
    else {
     return next();
    }
  }
}

module.exports = routeHelpers;