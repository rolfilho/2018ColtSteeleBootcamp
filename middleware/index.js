var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err){
               console.log(err);
               req.flash("error", "This campground does not exist");
               res.redirect("back");
            }
            else {
                
                if (!foundCampground) {
                    req.flash("error", "Campground not found");
                    return res.redirect("back");
                }
                
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
           }
        });
   }
   else {
       req.flash("error", "You need to be logged in to do that");
       res.redirect("back");
   }
};

//Check comment ownership
middlewareObj.checkCommentOwnership = function checkCommentOwnership (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.idComment, function(err,foundComment){
            if(err){
               console.log(err);
               req.flash("error", "This comment does not exist");
               res.redirect("back");
            }
            else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
           }
        });
   }
   else {
       req.flash("error", "You need to be logged in to do that");
       res.redirect("back");
   }
};


//Middleware
middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    else {
        req.flash("error", "You need to be logged in to perform this operation");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;