app.get('/', function (req, res){
  res.render('/index');
});

var loginMiddleware = require('../middleware/loginHelper.js');

app.use(loginMiddleware);

require('./users');
require('./posts');
require('./comments');