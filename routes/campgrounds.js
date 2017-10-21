var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
// require and configure node-geocoder
const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'google'
};
const geocoder = NodeGeocoder(options);

//const { isLoggedIn, checkCampgroundOwnership, checkCommentOwnership } = middleware; // destructuring assignment
const { cloudinary, upload } = require('../middleware/cloudinary');

//INDEX - SHOW ALL CAMPGROUNDS
router.get("/campgrounds", function(req, res){
  
    if(req.query.search){
        const regex = new RegExp(middleware.escapeRegex(req.query.search), 'gi');
        //eval(require("locus"));
        Campground.find({name: regex},function(err, filteredCampgrounds){
            if(err){
                console.log(err);
            }
            else {
                res.render("campgrounds/index", {campgrounds: filteredCampgrounds, page: "campgrounds"});
            }
        });
        
    }
    else {
        Campground.find({},function(err, allCampgrounds){
            if(err){
                console.log(err);
            }
            else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});
            }
        });
    }
});

//EDIT
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err,foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE
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
            req.flash("success","Campground successfully updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

//DESTROY
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err,deletedCampground){
       if(err){
           console.log(err);
           req.flash("error", "Couldn't delete campground");
           res.redirect("/campgrounds");
       }
       else {
           req.flash("success", "Campground successfully deleted");
           res.redirect("/campgrounds");
       }
   }); 
});

//=========================CREATE ROUTE=======================
//==========================================================

router.post("/campgrounds", upload.single('image'), async (req, res) => {
  console.log(req.body);
  // check if file uploaded otherwise redirect back and flash an error message
  if(!req.file) {
    console.log("no file!!");
    req.flash('error', 'Please upload an image.');
    return res.redirect('back');
  }
  // try/catch for async + await code
  try {
      // get data from form and add to campgrounds array
      let name = req.body.name;
      let desc = req.body.description;
      let author = {
          id: req.user._id,
          username: req.user.username
      };
      let price = req.body.price;
      // upload image to cloudinary and set resulting url to image variable
      let result = await cloudinary.uploader.upload(req.file.path);
      let image = result.secure_url;
      // get map coordinates for location and assign to lat and lng variables
      let geoLocation = await geocoder.geocode(req.body.location);
      let location = geoLocation[0].formattedAddress;
      let lat = geoLocation[0].latitude;
      let lng = geoLocation[0].longitude; 
      // build the newCampground object
      let newCampground = {
        name: name,
        image: image,
        description: desc,
        price: price,
        author: author,
        location: location,
        lat: lat,
        lng: lng
      };
      // create campground
      await Campground.create(newCampground);
  } catch (err) {
      console.log(err);
      req.flash('error', err.message);
  }
  res.redirect('/campgrounds');
});

//NEW
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
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