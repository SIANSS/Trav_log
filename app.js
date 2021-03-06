var express =require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressvalidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/loginapp');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

// initialize loginapp

var app = express();

//  View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({'defaultLayout':'layout'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret : 'her',
    saveUnitialized : true,
    resave : true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressvalidator({
  errorFormatter: (param, msg, value) => {
    var namespace = param.split('.')
    , root      = namespace.shift()
    , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(flash());

app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg  = req.flash('error_msg');
  res.locals.error      = req.flash('error');
  next();
});

app.use('/', routes);
app.use('/users', users);

app.set('port', (process.env.PORT || 4446));

app.listen(app.get('port'), ()=>{
  console.log('server started on port ' +app.get('port'));
});
