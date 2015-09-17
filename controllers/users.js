var db = require('../models/index.js');
var routeMiddleware = require('../middleware/routeHelper.js');

//Renders a list of all users:
app.get('/users', function (req, res){
  db.User.find( {}, function(err, users) {
    if (err) throw err;
      res.render('users/users', {localsUser: res.locals.user, users: users});
  });
});

//Renders a user signup form page:
app.get('/signup', routeMiddleware.preventLoginSignup, function(req, res){
  res.render('users/signup', {localsUser: res.locals.user});
});

//Posts a new user and redirects to the index:
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

//Renders the login page:
app.get('/login', routeMiddleware.preventLoginSignup, function (req, res){
  res.render('users/login', {localsUser: res.locals.user});
});

//Authenticates user login and logs user in. Redirects to the index or to the login if fail:
app.post('/login', function (req, res){
  db.User.authenticate(req.body.user, function (err, user){
    if (!err && user !== null) {
      req.login(user);
      res.redirect('/');
    } else {
      console.log(err);
      res.redirect('users/login');
    }
  });
});

//Ensures logged in, and logs out, else bounces to login page:
app.get('/logout', routeMiddleware.ensureLoggedIn, function (req, res) {
  req.logout();
  res.redirect('/');
});

//Shows a logged in page of the user index
app.get('/users/:id', routeMiddleware.ensureLoggedIn, function (req, res) {
  db.User.findById(req.params.id, function(err, user) {
    if (err) throw err;
    res.render('users/index', {localsUser: res.locals.user, user: user});
  });
});

//Shows a user edit page:
app.get('/users/:id/edit', routeMiddleware.ensureLoggedIn, function (req, res) {
  db.User.findById(req.params.id, function(err, user) {
    if (err) throw err;
    res.render('users/edit', {localsUser: res.locals.user, user: user});
  });
});

//Updates a user profile:
app.put('users/:id/edit', routeMiddleware.ensureLoggedIn, function (req, res) {
  db.User.findByIdAndUpdate(req.params.id, req.body.user, function (err, user){
    if (err){
      console.log(err);
      res.redirect('/login');
    } else {
      res.redirect('/');
    }
  });
});

//Deletes a user:
app.delete('/users/:id', function(req, res){
   db.User.findByIdAndRemove(req.params.id, function (err, data){
    if (err){
      throw err;
    } else {
      res.redirect('/users');
    }
  });
});
