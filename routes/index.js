var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var url  = require('url');
var http = require('http');
var request = require("request");
var useremail;
var foundedURL="";
var url = "mongodb://AlaaAlkassar:Alaa123!!!@ds151927.mlab.com:51927/users";
var MongoClient = mongodb.MongoClient;
var userURLS=[];
var config ={};
var jsdom = require('jsdom');
var Loginusername;

config.webhost='http://aurls.herokuapp.com/';

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
    var convUrl = randomString(4);
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
  res.render('signup', { title: 'Signup',msg:"" });
});

router.get('/login',function (re, res) {
  res.render('login',{title:'Login'});
});

router.post('/adduser', function(req, res) {


  useremail = req.body.email;
  Loginusername=req.body.username;

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
            res.render('dashboard',{
              "dashboard": userURLS=[],
              username:Loginusername
            });
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
                res.redirect("dashboard");
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
  var userURLS=[];
  useremail = req.body.email;

  var url = "mongodb://AlaaAlkassar:Alaa123!!!@ds151927.mlab.com:51927/users";

  var user={
    email:useremail,
    password:req.body.password
  };

  router.get('/dashboard1', function(req, res){


    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the Server', err);
      } else {
        console.log('Connection established to', url);

        // Get the documents collection
        var collection = db.collection('urls');
        collection.find({email:useremail}).toArray(function (err, result) {
          if (err) {
            res.send(err);
          } else if (result.length) {
            userURLS=result;
            console.log(userURLS);
            res.render('dashboard',{
              username:Loginusername,
            "dashboard": userURLS
            });
          } else {
            res.render('dashboard', {
              username:Loginusername,
              "dashboard": userURLS

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
      collection.find({email:useremail}).toArray(function (err, doc) {
        if(err){
          res.send(err);
          }else if(doc.length){
            var UsernameArray=doc;
          Loginusername=UsernameArray[0].username;
          console.log(Loginusername);
          res.redirect("dashboard1");
          }else{
          res.render('fup', {msg: "Invalid Email or Password"});
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
            collection.find({email: useremail}).toArray(function (err, doc) {
              if (err) {
                res.send(err);
              } else if (doc.length) {
                userURLS= doc;

                res.render('dashboard', {
                  username:Loginusername,
                  newgeneratedurl: config.webhost+ foundedURL,
                  "dashboard": doc
                });
              } else {
                res.send('No documents found');
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
          var url = {
            email: useremail,
            newurl: genurl,
            oldurl: userurl
          };
          collection.find({oldurl: userurl}).toArray(function (err, doc) {
            if (err) {
              res.send(err);
            } else if (doc.length) {
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
                  collection.insert({email:useremail,oldurl:userurl,newurl:foundedURL}, function (err, doc) {
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
        username:Loginusername,
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
        username:Loginusername,
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
        console.log("CHECK None exist email: "+useremail);
        // Find the user data in the database
        collection.deleteMany({email:useremail},function (err, result) {
          if(err){
            res.send(err);
          }else if(result.length) {
            console.log(result.length);
          }else{
            userURLS=[];
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
    var urlsAfterDeleteOne;
  /*  router.get('/dashboard2', function(req, res){
      res.render('dashboard',{
        email: useremail,
        "dashboard": urlsAfterDeleteOne
      });

    });*/

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
        MongoClient.connect(url, function(err, db){
          if (err) {
            console.log('Unable to connect to the Server:', err);
          } else {
            var collection = db.collection('urls');
            collection.find({email:useremail}).toArray(function (err, result) {
          if (err) {
            res.send(err);
          } else if (result.length) {
            console.log("Test");
            urlsAfterDeleteOne=result;
            res.render('dashboard',{
              username:Loginusername,
              "dashboard": urlsAfterDeleteOne
            });
      }else{
            console.log("Test1111111111");
            urlsAfterDeleteOne=[];
            res.render('dashboard',{
              username:Loginusername,
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
