var mongoose = require('mongoose');
var db = require('./index');


var postSchema = new mongoose.Schema({
  title: String,
  body: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

postSchema.pre('remove', function(next) {
  var post = this;
  db.User.findById(post.user, function(err, user) {
    User.remove({posts: post._id}).exec(function(err2, user2) {
      if (err2) throw err2;
      next();
    });
  });
});

var Post = mongoose.model("Post", postSchema);

module.exports = Post;