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
  db.User.findByIdAndUpdate(post.user, {$pull: {posts: post._id}}, function(err, user) {
    next();
  });
});

var Post = mongoose.model("Post", postSchema);

module.exports = Post;