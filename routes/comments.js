var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//NEW
router.get("/campgrounds/:id/comments/new", middleware.IsLoggedIn, function(req, res) {
    //find Campground by ID
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            req.flash("error", "Comment not found!");
        }
        else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//CREATE
router.post("/campgrounds/:id/comments", middleware.IsLoggedIn, function(req, res){
   //look up campground using id
   Campground.findById(req.params.id, function(err, campground) {
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       }
       else {
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               }
               else {
                   //add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   //save comments
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   req.flash("succces", "Comment created!");
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
   });
});

//EDIT
router.get("/campgrounds/:idCampground/comments/:idComment/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.idCampground, function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else {
            Comment.findById(req.params.idComment, function(err, foundComment) {
                if(err){
                    console.log(err);
                }
                else {
                    res.render("comments/edit",
                    {
                        campground: foundCampground,
                        comment: foundComment
                    }); 
                }
            });
        }

        
    });
});

//UPDATE
router.put("/campgrounds/:idCampground/comments/:idComment", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.idComment, req.body.comment, function(err,updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else {
           req.flash("success", "Comment updated");
           res.redirect("/campgrounds/" + req.params.idCampground);
        }
    });
});

//DESTROY
router.delete("/campgrounds/:idCampground/comments/:idComment", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.idComment, function(err, deletedComment){
       if(err){
           console.log(err);
           res.redirect("back");
       }
       else {
           req.flash("success", "Comment deleted");
           res.redirect("/campgrounds/" + req.params.idCampground);
       }
   }); 
});


module.exports = router;
