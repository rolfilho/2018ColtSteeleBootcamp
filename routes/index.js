var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require("../models/user");

router.get("/", function(req, res){
   res.render("landing");
});

router.get("/register", function(req, res) {
   res.render("register", {page: "register"}); 
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error","Error!");
            return res.render("register", {errorMessage: err.message});
        }
        else {
            passport.authenticate("local")(req, res, function(){
            req.flash("Successfully signed up!","Welcome to YelpCamp, " + user.username);
            res.redirect("/campgrounds");
           });
       }
   });
});

router.get("/login", function(req, res) {
   res.render("login", {page: "login"}); 
});

router.post("/login", passport.authenticate("local",
    
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    function(req, res) {}
);

//Logout route
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success","You've succesfully logged out");
   res.redirect("/campgrounds");
});

module.exports = router;