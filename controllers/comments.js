var db = require('../models/index');
var routeMiddleware = require('../middleware/routeHelper.js');

//Requests a new comment on a post:
app.get('/posts/:post_id/comments/new', routeMiddleware.ensureLoggedIn, function (req, res) {
  db.Post.findById(req.params.post_id, function(err, comment) {
    if (err) throw err;
    res.render('posts/:post_id/comments', {localsUser: res.locals.user, comment: comment});
  });
});

//Posts a new comment on a post
app.post('/posts/:post_id/comments/:comment_id', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Post.findById(req.session.post_id, function(err, post) {
    if (err) throw err;
    db.Comment.create(req.body.comment, function(err, comment) {
      if (err) throw err;
      post.comments.push(comment);
      post.author = user;
      user.save();
      post.save(function(err, post2) {
        res.redirect('/posts/' + post2._id);
      });
    });
  });
});

//edit a comment:
app.put('/posts/:id', routeMiddleware.ensureLoggedIn, function(req, res){
  db.Post.findByIdAndUpdate(req.session.id, req.body.post, function(err, post) {
    if (err) throw err;
    res.redirect('/posts/' + post._id);
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