var db = require('../models');

var loginHelpers = function (req, res, next){
  req.login = function (user) {
    req.session.id = user_id;
  };

  req.logout =  (){
    req.session.id = null;
  };

  next();
};

module.exports = loginHelpers;