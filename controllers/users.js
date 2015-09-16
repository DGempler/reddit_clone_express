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
      res.redirect('/');
    }
  });
});

app.get('/login', routeMiddleware.preventLoginSignup, function (req, res){
  res.render('users/login');
});

app.post('/login', routeMiddleware.ensureLoggedIn, function (req, res){
  db.User.authenticate(req.body.user, function (err, user){
    if (!err && user !== null) {
      req.login(user);
      res.redirect('/');
    } else {
      res.redirect('users/login');
    }
  });
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/users/:id', routeMiddleware.ensureLoggedIn, function (req, res) {
  db.User.findById(req.params.id, function(err, user) {
    if (err) throw err;
    res.render('users/index', {user: user});
  });
});
