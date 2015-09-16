app.get('/', function (req, res){
  res.render('/index');
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
