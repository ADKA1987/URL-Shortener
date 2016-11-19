var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var url  = require('url');
var http = require('http');
var request = require("request");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
//var session = require('express-session');
var NodeSession = require('node-session');
var cookieSession = require('cookie-session')
var app = express();
var url = "mongodb://AlaaAlkassar:Alaa123!!!@ds151927.mlab.com:51927/users";
var MongoClient = mongodb.MongoClient;
var config ={};
var jsdom = require('jsdom');
var req = require("passport/lib/authenticator.js");
var cookie = require("express-session/session/cookie.js");
//session = new NodeSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});
config.webhost='http://aurls.herokuapp.com/';

//app.use(session({secret: 'ssshhhhh'}));
router.use(cookieParser());

router.use(expressSession({secret:'somesecrettokenhere'}));

router.use(bodyParser());
router.get('/test',function (req, res) {
  res.render('test',{tittle:'test'});
});

var publicURL="";
var publicfoundedURL="";
//var publicUrl;
router.get('/',function (req, res) {
  res.render('index',{tittle:'URL Shortener',
    newurl:"",
    oldurl:""
  });
});

router.post('/',function (req,res) {

  publicURL = req.body.publicurl;
  console.log(publicURL);
  console.log('I found it');
  var url = "mongodb://AlaaAlkassar:Alaa123!!!@ds151927.mlab.com:51927/users";
  var MongoClient = mongodb.MongoClient;
  var convUrl = randomString(5);
  var foundedURLArray=[];

  router.get('/newurl', function (req, res) {
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the Server', err);
      } else {
        console.log('Connection established to', url);
        var collection = db.collection('publicurl');
        collection.find({oldurl: publicURL}).toArray(function (err, doc) {
          if (err) {
            res.send(err);
          } else if (doc.length) {
            userURLS= doc;
            publicfoundedURL=userURLS[0].newurl;
            res.render('index', {
              newurl:config.webhost + publicfoundedURL,
              oldurl:publicURL
            });
          } else {
            res.render('/', {

              msg: 'Could not Generate'
            });}
          db.close();
        });
      }
    });
  });

  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server');
      var collection = db.collection('publicurl');
      var url = {
        newurl: convUrl,
        oldurl: publicURL
      };
      collection.find({oldurl: publicURL}).toArray(function (err, doc) {
        if (err) {
          res.send(err);
        } else if (doc.length) {
          foundedURLArray=doc;
          foundedURL=foundedURLArray[0].newurl;
          res.redirect("newurl");
        } else {
          collection.insert([url], function (err, doc) {
            if (err) {
              res.send(err);
            } else {
              publicfoundedURL=convUrl;
              res.redirect("newurl");
            }
          });
        }
      });
    }
  });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Signup', msg:"" });
});

router.get('/login',function (req, res) {

  res.render('login',{title:'Login',msg:""});
});

router.post('/signup', function(req, res) {


  var useremail = req.body.email;
  //var Loginusername=req.body.username;


  router.get('/dashboard', function (req, res) {


    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the Server', err);
      } else {
        console.log('Connection established to', url);

        var collection = db.collection('urls');
        collection.find({email:useremail}).toArray(function (err,doc) {
          if (err) {
            res.send(err);
            db.close();
          } else {
            res.render('login',
                {msg:"You are registered and You can login with your Email and Password"});
            db.close();
          }
        });

      }
    });
  });
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server:' + url);

      // Get the documents collection
      var collection = db.collection('users');

      // Get the user data passed from the form
      var user = {
        username: req.body.username,
        email: useremail,
        password: req.body.password
      };
      collection.find({email: useremail}).toArray(function (err, result, next) {
          if (err) {
            res.send(err);
          } else if (result.length) {
            res.render('fup', {msg: "This Email is Already used"});
          } else {
            if(req.body.password!=req.body.confirm_password){
              res.render('signup',{ title:"URL Shortener",
                    msg:"Password Not Match"
                  }
              )
            }else{
              // Insert the user data into the database
              collection.insert([user], function (err, doc) {
                if (err) {
                  res.send(err);
                } else {
                  userURLS=[];
                  // Redirect to the updated student list
                  res.render('login',
                      {msg:"You are registered and You can login with your Email and Password"});
                }
                // Close the database
                db.close();
              });
            }
          }
        });
    }
  });
});

router.post('/loginuser',function (req, res) {


  req.session.userEmail=req.body.email;
console.log("Login Email First  "+req.session.userEmail);
  console.log('This is the session User Email '+req.session.userEmail);
  req.session.userPassword=req.body.password;
  var url = "mongodb://AlaaAlkassar:Alaa123!!!@ds151927.mlab.com:51927/users";

  router.get('/dashboard1', function(req, res){

   MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the Server', err);
      } else {
        console.log('Connection established to', url);

        // Get the documents collection
        var collection = db.collection('urls');
        collection.find({email:req.session.userEmail}).toArray(function (err, result) {
          if (err) {
            res.send(err);
          } else if (result.length) {
            var userURLS=[];
            userURLS=result;
            var name;
            console.log(userURLS);
            res.render('dashboard',{
              email:req.session.userEmail,
              name:name,
              "dashboard": result
            });
          } else {
            console.log("here");
            var name;
            console.log(req.session.userEmail);
            res.render('dashboard', {
              email:req.session.userEmail,
              name: name,
              "dashboard": result

            });
            //Close connection
            db.close();
          }
        });
      }
    });
  });

  // Connect to the server
  MongoClient.connect(url, function(err, db){
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server');
      // Get the documents collection
      var collection = db.collection('users');


      // Find the user data in the database
      collection.find({email:req.session.userEmail,password:req.session.userPassword}).toArray(function (err, doc) {
        if(err){
          res.send(err);
        }else if(doc.length){
          var userSavedName=[];
          var name;
          userSavedName=doc;
          name=userSavedName[0].username;
          console.log(name);
          res.redirect("dashboard1");
        }
        else{
          res.render('login',{msg:"Invalid Email or Password"});
        }
      });
      db.close();
    }
  });

});

router.post('/main',function (req, res) {

  console.log(req.session.userEmail);

  var url = "mongodb://AlaaAlkassar:Alaa123!!!@ds151927.mlab.com:51927/users";
  var MongoClient = mongodb.MongoClient;
  var submitvalue= req.body.submit;
  var userURLS=[];

  if(submitvalue=="url") {

    var userurl = req.body.urltext;

    if (userurl.length) {
      var genurl;
      var foundedURLArray;
      router.get('/dashboardn', function (req, res) {
        MongoClient.connect(url, function (err, db) {
          if (err) {
            console.log('Unable to connect to the Server', err);
          } else {
            console.log('Connection established to', url);
            var collection = db.collection('urls');
            collection.find({email: req.session.userEmail}).toArray(function (err, doc) {
              if (err) {
                res.send(err);
              } else if (doc.length) {
                userURLS= doc;
                res.render('dashboard', {
                  email: req.session.userEmail,
                  newgeneratedurl: config.webhost+ foundedURL,
                  "dashboard": doc
                });
              } else {
                userURLS= doc;
                res.render('dashboard', {
                  email: req.session.userEmail,
                  newgeneratedurl: "",
                  "dashboard": doc
                });
              }
              db.close();
            });
          }
        });
      });

      MongoClient.connect(url, function (err, db) {
        if (err) {
          console.log('Unable to connect to the Server:', err);
        } else {
          console.log('Connected to Server');
          var collection = db.collection('urls');
          var collectionPublic = db.collection('publicurl');
          genurl = randomString(5);
          console.log("Found User URL "+req.session.userEmail);
          var url = {
            email: req.session.userEmail,
            newurl: genurl,
            oldurl: userurl
          };
          collection.find({oldurl: userurl,email:req.session.userEmail}).toArray(function (err, doc) {
            if (err) {
              res.send(err);
            } else if (doc.length) {
              console.log(req.session.userEmail);
              console.log("Tessssssssssssssssssssssst");
              foundedURLArray=doc;
              foundedURL=foundedURLArray[0].newurl;
              res.redirect("dashboardn");
            } else {
              console.log("2");
              collectionPublic.find({oldurl: req.body.urltext}).toArray(function (err, doc) {
                if(err){
                  res.send(err);
                }else if(doc.length){
                  console.log("3");
                  foundedURLArray=doc;
                  foundedURL=foundedURLArray[0].newurl;
                  console.log(foundedURL);
                  console.log("This is the insert" +req.session.userEmail);
                  collection.insert({email:req.session.userEmail,oldurl:userurl,newurl:foundedURL}, function (err, doc) {
                    if (err) {
                      res.send(err);
                    } else {
                      foundedURL=foundedURLArray[0].newurl;
                      res.redirect("dashboardn");
                    }
                  });
                }else{
                  console.log("4");
                  collection.insert([url], function (err, doc) {
                    if (err) {
                      res.send(err);
                    } else {
                      console.log("Inserted into User database");
                      foundedURL=genurl;
                      res.redirect("dashboardn");
                    }
                  });
                  collectionPublic.insert({oldurl: userurl,newurl:genurl}, function (err, doc) {
                    if (err) {
                      res.send(err);
                    } else {
                      console.log("Inserted into Public Database");
                    }
                  });
                }
              });
            }
          });

        }
      });
    }else{
      res.render('dashboard', {
        email: req.session.userEmail,
        msg:"Enter URL",
        "dashboard": userURLS
      });
    }
  }
  else if(submitvalue=="removeAll"){
    var url = "mongodb://AlaaAlkassar:Alaa123!!!@ds151927.mlab.com:51927/users";

    var MongoClient = mongodb.MongoClient;

    router.get('/dashboard3', function(req, res){
      res.render('dashboard',{
        email: req.session.userEmail,
        msg:"There are no URLs to delete!!!",
        // Pass the returned database documents to Jade
        //"dashboard": result
        "dashboard": userURLS
      });

    });

    MongoClient.connect(url, function(err, db){

      if (err) {
        console.log('Unable to connect to the Server:', err);
      } else {
        console.log('Connected to Server');

        // Get the documents collection
        var collection = db.collection('urls');
        console.log("CHECK None exist email: "+ req.session.userEmail);
        // Find the user data in the database
        collection.deleteMany({email:req.session.userEmail},function (err, result) {
          if(err){
            res.send(err);
          }else if(result.length) {
            console.log(result.length);
          }else{
            var userURLS=[];
            res.redirect("dashboard3");
          }
        });
        // Close the database
        db.close();
      }
    });
  }else{

    var url = "mongodb://AlaaAlkassar:Alaa123!!!@ds151927.mlab.com:51927/users";
    var MongoClient = mongodb.MongoClient;
    var deleteOneRaw=req.body.submit;



    MongoClient.connect(url, function(err, db){

      if (err) {
        console.log('Unable to connect to the Server:', err);
      } else {
        console.log('Connected to Server');

        // Get the documents collection
        var collection = db.collection('urls');
        // Remove the user data in the database
        collection.remove({newurl:deleteOneRaw},function (err, result) {
          if(err){
            res.send( err);
          }else{
            FindTherestURLS();
          }
        });
      }
      // Close the database
      db.close();
    });

  }
  function FindTherestURLS() {
    var url = "mongodb://AlaaAlkassar:Alaa123!!!@ds151927.mlab.com:51927/users";
    var MongoClient = mongodb.MongoClient;
    var urlsAfterDeleteOne;
    MongoClient.connect(url, function(err, db){
      if (err) {
        console.log('Unable to connect to the Server:', err);
      } else {
        var collection = db.collection('urls');
        collection.find({email:req.session.userEmail}).toArray(function (err, result) {
          if (err) {
            res.send(err);
          } else if (result.length) {
            console.log("Test");
            urlsAfterDeleteOne=result;
            res.render('dashboard',{
              email: req.session.userEmail,
              "dashboard": urlsAfterDeleteOne
            });
          }else{
            console.log("Test1111111111");
            urlsAfterDeleteOne=[];
            res.render('dashboard',{
              email: req.session.userEmail,
              "dashboard": urlsAfterDeleteOne
            });
          }
        });
      }
    });
  };

});


function randomString(len, charSet) {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz,randomPoz+1);
  }
  return randomString;
};

module.exports = router;
