var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var url  = require('url');
var http = require('http');
var request = require("request");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var url = "mongodb://AlaaAlkassar:Alaa123!!!@ds151927.mlab.com:51927/users";
var MongoClient = mongodb.MongoClient;
var config ={};
var jsdom = require('jsdom');
var cookie = require("express-session/session/cookie.js");
config.webhost='http://aurls.herokuapp.com/';
var cheerio = require('cheerio');

router.use(cookieParser());

router.use(expressSession({secret:'somesecrettokenhere'}));

router.use(bodyParser());
router.get('/test',function (req, res) {
  res.render('test',{tittle:'test'});
});

var publicURL="";
var publicfoundedURL="";

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
      var collection = db.collection('users');
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
              });
            }else{
              collection.insert([user], function (err, doc) {
                if (err) {
                  res.send(err);
                } else {
                  userURLS=[];
                  res.render('login',
                      {msg:"You are registered and You can login with your Email and Password"});
                }
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
  var url = "mongodb://AlaaAlkassar:Alaa123!!!@ds151927.mlab.com:51927/users";
  var MongoClient = mongodb.MongoClient;
  var submitvalue= req.body.submit;
  var userURLS=[];
  var userurl = req.body.urltext;
  var urlTitle;
  if(submitvalue=="url") {

    if (userurl.length) {
      var genurl;
      var foundedURLArray;

      //This Part Of getting the Page title, i copied from http://jonathanmh.com/web-scraping-web-crawling-pages-with-node-js/
      //and i modified it.

     request(userurl, function (error, response, body) {
        if (!error) {
          var $ = cheerio.load(body)

          urlTitle= $('title').text();
        }
        else {
          console.log("We’ve encountered an error: " + error);
        }
      });
      console.log(urlTitle);

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
          genurl = randomString(4);
          console.log("Found User URL "+req.session.userEmail);
          var url = {
            email: req.session.userEmail,
            newurl: genurl,
            oldurl: userurl,
            urltitle:urlTitle
          };
          collection.find({oldurl: userurl,email:req.session.userEmail}).toArray(function (err, doc) {
            if (err) {
              res.send(err);
            } else if (doc.length) {
              foundedURLArray=doc;
              foundedURL=foundedURLArray[0].newurl;
              res.redirect("dashboardn");
            } else {
              collectionPublic.find({oldurl: req.body.urltext}).toArray(function (err, doc) {
                if(err){
                  res.send(err);
                }else if(doc.length){
                  foundedURLArray=doc;
                  foundedURL=foundedURLArray[0].newurl;
                  collection.insert({email:req.session.userEmail,oldurl:userurl,newurl:foundedURL,urltitle:urlTitle}, function (err, doc) {
                    if (err) {
                      res.send(err);
                    } else {
                      foundedURL=foundedURLArray[0].newurl;
                      urlTitle = foundedURLArray[0].urltitle;
                      res.redirect("dashboardn");
                    }
                  });
                }else{
                  collection.insert([url], function (err, doc) {
                    if (err) {
                      res.send(err);
                    } else {
                      foundedURL=genurl;
                      res.redirect("dashboardn");
                    }
                  });
                  collectionPublic.insert({oldurl: userurl,newurl:genurl,urltitle:urlTitle}, function (err, doc) {
                    if (err) {
                      res.send(err);
                    } else {
                      console.log("Insert new URL Into public database");
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
        msg:"Could not generate an empty url",
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
        "dashboard": userURLS
      });
    });

    MongoClient.connect(url, function(err, db){
      if (err) {
        console.log('Unable to connect to the Server:', err);
      } else {
        console.log('Connected to Server');
        var collection = db.collection('urls');
        console.log("CHECK None exist email: "+ req.session.userEmail);
        collection.deleteMany({email:req.session.userEmail},function (err, result) {
          if(err){
            res.send(err);
          }else if(result.length) {
            console.log(result.length);
          }else{
            res.redirect("dashboard3");
          }
        });
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
        var collection = db.collection('urls');
        collection.remove({newurl:deleteOneRaw},function (err, result) {
          if(err){
            res.send( err);
          }else{
            FindTherestURLS();
          }
        });
      }
      db.close();
    });

  };
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
