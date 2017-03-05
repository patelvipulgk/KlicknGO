var express     = require('express');
var app         = express();
var server      = require('http').createServer(app);
var io          = require('socket.io')(server);
var socketioJwt = require('socketio-jwt');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	  = require('passport');
var config      = require('./config/db'); // get db config file
var port        = process.env.PORT || 3030;
// Pass passport for configuration
var auth        = require('./config/passport')(passport);

var user        = require('./app/routes/user');
var contact        = require('./app/routes/contact');
var conversation        = require('./app/routes/conversation');
var authenticate= require('./app/routes/authenticate');
 
// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
// log to console
app.use(morgan('dev'));
 
// Use the passport package in our application
app.use(auth.initialize());


// connect to database
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

var apiRoutes = express.Router();

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
app.use('/api', user);
app.use('/api', authenticate);
app.use('/api', contact);
app.use('/api', conversation);
// Start the server
// Listen application request on port 3000
server.listen(port);

// Route for test 
app.get('/', function(req, res) {
  res.send('Klick n GO API is at http://localhost:' + port + '/api');
});

/** Chat application  */
app.get('/chat', function(req, res){
  res.sendfile('index.html');
});

/** socket */
require('./app/utils/socket')(io);

console.log('Klick n GO : http://localhost:' + port);