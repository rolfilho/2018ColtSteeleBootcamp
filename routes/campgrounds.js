var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX - SHOW ALL CAMPGROUNDS
router.get("/campgrounds", function(req, res){
    // Get all campgrounds
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

//EDIT
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err,foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       }
       else {
           res.redirect("/campgrounds/" + updatedCampground._id);
       }
   });
});

//DESTROY
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err,deletedCampground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       }
       else {
           res.redirect("/campgrounds");
       }
   }); 
});

//CREATE
router.post("/campgrounds", middleware.IsLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {id: req.user._id, username: req.user.username};
    var newCampground = {
        name: name,
        image: image,
        description: description,
        price: price,
        author: author
    };
    Campground.create(newCampground,function(err, newlyCreatedCampground){
        if(err){
            console.log(err);
        }
        else {
            res.redirect("/campgrounds");
        }
    });
});

//NEW
router.get("/campgrounds/new", middleware.IsLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

//SHOW
router.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(
        function(err, foundCampground){
            if(err){
                console.log(err);
            }
            else {
                res.render("campgrounds/show", {campground: foundCampground}); 
            }
        }
    );
    
});


module.exports = router;