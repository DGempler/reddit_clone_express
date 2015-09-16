var express = require('express');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var db = require('./models');
var exphbs = require('express-handlebars');
var morgan = require("morgan");
var session = require('cookie-session')


​
//creates global variable
app = express();
​
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
​
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
​
app.use(session({
  maxAge: 3600000,
  secret: "specialspecial",
  name: "reddit-session"
}));

require('./controllers/index');
​







app.listen(3000, function() {
  console.log("Starting a server on http://localhost:3000");
});