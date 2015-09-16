var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


var SALT_WORK_FACTOR = 10;

var userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
});


userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

/*
userSchema.pre('remove', function(next) {
  Post.remove({user_id: this._id}).exec();
  Comment.remove({user_id: this._id}).exec();
  next();
});
*/


userSchema.statics.authenticate = function (formData, callback) {
  this.findOne({
    email: formData.email
  },
  function(err, user) {
    if (user === null) {
      callback("Invalid username or password", null);
    }
    else {
      user.checkPassword(formData.password, callback);
    }
  });
};

userSchema.methods.checkPassword = function(password, callback) {
  var user = this;
bcrypt.compare(password, user.password, function (err, isMatch) {
  if (isMatch) {
    callback(null, user);
  }
  else {
    callback(err, null);
  }
});
};

var User = mongoose.model("User", userSchema);

module.exports = User;