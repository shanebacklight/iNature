var express = require("express");
var router = express.Router();
var User = require("../models/user.js");
var passport = require("passport");

router.get("/", function(req, res){
    res.render("landing.ejs");
});

//Register Route

router.get("/register", function(req, res){
   res.render("register.ejs"); 
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err || !user){
            req.flash("error", err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to iNature "+ user.username);
            res.redirect("/photo"); 
        });
    });
});

//Login Route
router.get("/login", function(req, res){
   res.render("login.ejs"); 
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/photo",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to Come Back!'
    }), function(req, res){
});

// Logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "logged you out")
   res.redirect("/photo");
});

module.exports = router;