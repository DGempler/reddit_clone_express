var db = require('../models/index');
var routeMiddleware = require('../middleware/routeHelper.js');

//request for rendering a new post form
app.get('/posts/new', routeMiddleware.ensureLoggedIn, function(req, res) {
  res.render('posts/new', {localsUser: res.locals.user});
});

//submitting a new post
app.post('/posts', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.User.findById(req.session.id, function(err, user) {
    if (err) throw err;
    db.Post.create(req.body.post, function(err, post) {
      if (err) throw err;
      user.posts.push(post);
      post.user = user._id;
      post.userName = user.userName;
      user.save();
      post.save(function(err, post2) {
        res.redirect('/posts/' + post2._id);
      });
    });
  });
});

//get request for editing a post
app.get('/posts/:id/edit', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Post.findById(req.params.id, function(err, post) {
    if (err) throw err;
    console.log(post.user);
    if (post.user === req.session.id) {
      res.render('posts/edit', {localsUser: res.locals.user});
    }
    else {
      res.redirect('/users/' + req.session.id);
    }
  });
});

//edit a post
app.put('/posts/:id', routeMiddleware.ensureLoggedIn, function(req, res){
  db.Post.findById(req.session.id, function(err, post) {
    if (err) throw err;
    if (post.user === req.session.id) {
      post = req.body.post;
      post.save(function(err2, post2) {
        res.redirect('/posts/' + post2._id);
      });
    }
  });
});

//delete a post
app.delete('/posts/:id', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Post.findById(req.params.id, function(err, post) {
    if (err) throw err;
    post.remove(function(err2, post2) {
      if (err2) throw err2;
      res.redirect('/users/' + post2.user);
    });
  });
});

//Show individual post
app.get('/posts/:id', function(req, res) {
  db.Post.findById(req.params.id).populate('user').populate('comments').exec(function(err, post) {
    if (err) throw err;
    var isUsers = null;
    if (post.user && req.session.id == post.user._id){
      isUsers = true;
    }
    res.render('posts/index', {post: post, localsUser: res.locals.user, isUsers: isUsers});
  });
});

//show individual user's posts
app.get('/users/:id/posts', function(req, res) {
  db.User.findById(req.params.id).populate('posts').exec(function(err, user) {
    if (err) throw err;
    res.render('posts/show', {user: user, localsUser: res.locals.user});
  });
});
