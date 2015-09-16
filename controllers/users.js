var db = require('../models/index.js');
var routeMiddleware = require('../middleware/routeHelper.js');

app.get('/signup', routeMiddleware.preventLoginSignup, function(req, res){
  res.render('users/signup');
});

app.post('/signup', function (req, res) {
  db.User.create(req.body.user, function (err, user){
    if (err){
      console.log(err);
      res.redirect('/signup');
    } else {
      req.login(user);
      res.redirect('/index');
    }
  });
});
