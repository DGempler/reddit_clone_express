var db = require('../models/index');
var routeMiddleware = require('../middleware/routeHelper.js');

//request for rendering a new post form
app.get('/posts/new', function(req, res) {
  res.render('posts/new', {localsUser: res.locals.user});
});

//submitting a new form
app.post('/posts', function(req, res) {
  db.User.findById(req.session.id, function(err, user) {
    if (err) throw err;
    db.Post.create(req.body.post, function(err, post) {
      if (err) throw err;
      user.posts.push(post);
      post.author = user;
      user.save();
      post.save(function(err, post2) {
        res.redirect('/posts/' + post2._id);
      });
    });
  });
});

//edit a form



//delete a form



//Show individual post
app.get('/posts/:id', function(req, res) {
  db.Post.findById(req.params.id).populate('user').populate('comments').exec(function(err, post) {
    if (err) throw err;
    res.render('posts/index', {post: post, localsUser: res.locals.user});
  });
});

//show individual user's posts
app.get('/users/:id/posts', function(req, res) {
  db.User.findById(req.params.id).populate('posts').exec(function(err, user) {
    if (err) throw err;
    res.render('posts/show', {user: user, localsUser: res.locals.user});
  });
});
