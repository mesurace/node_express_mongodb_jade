var express = require('express');
var router = express.Router();
var path = require("path");
var uuid = require("uuid");

var multer=require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

var upload = multer({ storage: storage })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Node + Mongodb + Jade Project' });
});

module.exports = router;

/* GET Hello World page. */
router.get('/addUser', function(req, res) {
    res.render('addUser', { title: 'Add User'});
});

/* GET Hello World page. */
router.post('/upload', upload.any(), function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    var fileName=req.files[0].originalname;

    collection.insert(req.body, function(err, result){
        collection.update({_id:result._id}, {$set:{imageUrl:fileName}});
            res.redirect('/');

    });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});


/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

