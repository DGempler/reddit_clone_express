var db = require('../models/index');
var loginMiddleware = require('../middleware/loginHelper.js');

app.use(loginMiddleware);

// using locals

app.use(function(req, res, next) {
  if (req.session.id) {
    db.User.findById(req.session.id, function(err, user) {
      res.locals.user = user;
      next();
    });
  } else {
    res.locals.user = null;
    next();
  }
});

app.get('/', function (req, res){
  db.Post.find({}).populate('user').exec(function(err, posts) {
    if (err) throw err;
    res.render('index', {posts: posts, localsUser: res.locals.user});
  });
});

require('./users');
require('./posts');
require('./comments');

//Catch all

app.use(function(req, res) {
  res.redirect('https://www.reddit.com/3eq');
});
