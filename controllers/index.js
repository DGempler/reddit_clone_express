var db = require('../models/index');

app.get('/', function (req, res){
  db.Post.find({}, function(err, posts) {
    if (err) throw err;
    if (req.session.id) {
      db.User.findById(req.session.id, function(err, user) {
        if (err) throw err;
          res.render('index', {posts: posts, user: user});
      });
    }
    else {
      res.render('index', {posts: posts});
    }
  });

});

var loginMiddleware = require('../middleware/loginHelper.js');

app.use(loginMiddleware);

require('./users');
require('./posts');
require('./comments');

//Catch all

app.use(function(req, res) {
  res.redirect('https://www.reddit.com/3eq');
});
