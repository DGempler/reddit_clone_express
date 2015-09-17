var db = require('../models/index');
var routeMiddleware = require('../middleware/routeHelper.js');

app.get('/users/:id/posts', function(req, res) {
  db.User.findById(req.params.id).populate('posts').exec(function(err, user) {
    if (err) throw err;
    res.render('posts/show', {user: user, localsUser: res.locals.user});
  });
});