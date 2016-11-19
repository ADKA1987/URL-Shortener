var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var index = require('./routes/index');
var users = require('./routes/users');
var MongoClient = require("mongodb");
var url = "mongodb://AlaaAlkassar:Alaa123!!!@ds151927.mlab.com:51927/users";
var app = express();
var sess;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false}
}))

app.get('/:encoded_id', function(req, res) {

  var reqestedurl = req.params.encoded_id;
  console.log(reqestedurl);
  if(reqestedurl.length){
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the Server:', err);
      } else {
        console.log('Connected to Server');
        var collection = db.collection('urls');
        var collectionPublic = db.collection('publicurl');
        collection.find({newurl: reqestedurl}).toArray(function (err, doc) {
          if (err) {
            res.send(err);
          } else if (doc.length) {
            console.log("Tessssssssssssssssssssssst");
            var foundedURLArray=doc;
            var  foundedURL=foundedURLArray[0].oldurl;
            res.redirect(foundedURL);
          } else {
            console.log("2");
            collectionPublic.find({newurl: reqestedurl}).toArray(function (err, doc) {
              if(err){
                res.send(err);
              }else if(doc.length){
                console.log("3");
                var  foundedURLArray=doc;
                var  foundedURL=foundedURLArray[0].oldurl;
                res.redirect(foundedURL);
              }else{
                res.redirect('/');
              }
            });
          }
        });

      }
    });
  }
  else {
    console.log(reqestedurl);
    res.render('index', { title: 'URL Shortener',
      msg:"",
      oldurl:"",
      newurl:""});
  }
});
app.get('/logout',function(req,res){
  req.session.destroy(function(err)
  {if(err) {
    console.log(err);
  } else {
    res.redirect('/');
  }
  })
});
app.get('/',function(req,res){
  sess = req.session;
  console.log(sess);
//Session set when user Request our app via URL
  if(sess.email) {
    /*
     * This line check Session existence.
     * If it existed will do some action.
     */
    res.redirect('/admin');
  }
  else {
    res.render('index.html');
  }
});

app.post('/login',function(req,res){
  sess = req.session;
//In this we are assigning email to sess.email variable.
//email comes from HTML page.
  sess.email=req.body.email;
  res.end('done');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.get('/signup', function(req, res) {
  res.render('signup', { title: 'Signup' });
});

app.get('/login',function (re, res) {
  res.render('login',{title:'Login'});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
