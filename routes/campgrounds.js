var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require('geocoder');

//INDEX - SHOW ALL CAMPGROUNDS
router.get("/campgrounds", function(req, res){
    // Get all campgrounds
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});
        }
    });
});

//EDIT
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err,foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});


router.put("/campgrounds/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});


// //UPDATE
// router.put("/campgrounds/:id", function(req, res){
//     console.log(req.body);
//     geocoder.geocode(req.body.location, function (err, data) {
//         var lat = data.results[0].geometry.location.lat;
//         var lng = data.results[0].geometry.location.lng;
//         console.log(lat + " - " + lng);
//         var location = data.results[0].formatted_address;
//         var name = req.body.name;
//         var image = req.body.image;
//         var description = req.body.description;
//         //var author = {id: req.user._id, username: req.user.username};
//         var price = req.body.price;
    
//         var updatedData = {
//             name: name,
//             image: image,
//             description: description,
//             price: price,
//             //author: author,
//             location: location,
//             lat: lat,
//             lng: lng};
            
//         // console.log(updatedData);
    
//         Campground.findByIdAndUpdate(req.params.id, {$set: updatedData}, function(err, updatedCampground){
//             if(err){
//                 req.flash("error", err.message);
//                 res.redirect("back");
//             } else {
//                 req.flash("success","Successfully Updated!");
//                 res.redirect("/campgrounds/" + updatedCampground._id);
//             }
//         });
//   });
// });

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

//NEW
router.post("/campgrounds", middleware.IsLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {id: req.user._id, username: req.user.username};
    var price = req.body.price;
    
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCampground = {
            name: name,
            image: image,
            description: description,
            author: author,
            lat: lat,
            lng: lng,
            location: location,
            price: price
        };
        
        
        Campground.create(newCampground,function(err, newlyCreatedCampground){
            if(err){
                console.log(err);
            }
            else {
                console.log(newlyCreatedCampground);
                res.redirect("/campgrounds");
            }
        });
        
        
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