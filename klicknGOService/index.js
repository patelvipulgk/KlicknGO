var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var config      = require('./config/db'); // get db config file
var User        = require('./app/models/user'); // get the mongoose model
var port        = process.env.PORT || 3030;
var jwt         = require('jwt-simple');
var individualUser        = require('./app/routes/individualUser');
 
// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
// log to console
app.use(morgan('dev'));
 
// Use the passport package in our application
app.use(passport.initialize());

// Pass passport for configuration
require('./config/passport')(passport);

var isClientAuthenticated = passport.authenticate('jwt', { session : false });

// connect to database
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

var apiRoutes = express.Router();

// Route for test 
app.get('/', function(req, res) {
  res.send('Klick n GO API is at http://localhost:' + port + '/api');
});


// create a new user account (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup', function(req, res) {
  if (!req.body.userName || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new User({
      userName: req.body.userName,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
  User.findOne({
    userName: req.body.userName
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token });
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

apiRoutes.get('/memberinfo', isClientAuthenticated, function(req, res) {
  var token = getToken(req.headers);
  console.log(token);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
console.log(JSON.stringify(decoded));
    User.findOne({
      userName: decoded.userName
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, msg: 'Welcome in the member area ' + user.userName + '!'});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});
 
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
 
 
// connect the api routes under /api/*
app.use('/api', apiRoutes);
app.use('/api', individualUser);

// Start the server
app.listen(port);
console.log('Klick n GO : http://localhost:' + port);