var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var seedData = [
    {
    name: "Camp1",
    image: "http://blog.lojadecamping.com.br/wp-content/uploads/caaaam.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et dui non est vehicula sagittis ut sed diam. Donec tempus ornare quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam facilisis libero et mauris lacinia tristique. Pellentesque eget ornare lorem. In hac habitasse platea dictumst. Praesent elementum, neque in efficitur scelerisque, erat eros venenatis metus, nec consectetur metus erat in ligula. Sed elementum nisi at nisi accumsan, dapibus congue augue posuere. Nunc rutrum risus sit amet dignissim molestie. Suspendisse felis sapien, pretium ut congue ac, aliquet fermentum nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam luctus felis vitae massa ultricies ornare. In ut varius enim, in suscipit nisl."
    },
    {
    name: "Camp2",
    image: "http://visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et dui non est vehicula sagittis ut sed diam. Donec tempus ornare quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam facilisis libero et mauris lacinia tristique. Pellentesque eget ornare lorem. In hac habitasse platea dictumst. Praesent elementum, neque in efficitur scelerisque, erat eros venenatis metus, nec consectetur metus erat in ligula. Sed elementum nisi at nisi accumsan, dapibus congue augue posuere. Nunc rutrum risus sit amet dignissim molestie. Suspendisse felis sapien, pretium ut congue ac, aliquet fermentum nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam luctus felis vitae massa ultricies ornare. In ut varius enim, in suscipit nisl."
    },
    {
    name: "Camp3",
    image: "https://www.pc.gc.ca/en/pn-np/ab/banff/activ/camping/~/media/802FD4AF791F4C6886E18CBF4A2B81B2.ashx?w=595&h=396&as=1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et dui non est vehicula sagittis ut sed diam. Donec tempus ornare quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam facilisis libero et mauris lacinia tristique. Pellentesque eget ornare lorem. In hac habitasse platea dictumst. Praesent elementum, neque in efficitur scelerisque, erat eros venenatis metus, nec consectetur metus erat in ligula. Sed elementum nisi at nisi accumsan, dapibus congue augue posuere. Nunc rutrum risus sit amet dignissim molestie. Suspendisse felis sapien, pretium ut congue ac, aliquet fermentum nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam luctus felis vitae massa ultricies ornare. In ut varius enim, in suscipit nisl."
    }
    ];

function seedDB(){
    //First, remove all campgrounds
    Campground.remove({},function(err){
        if(err){
            console.log(err);
        }
        else {
            console.log("removed campgrounds!");
        }
        
        seedData.forEach(function(seedCampground){
            Campground.create(seedCampground, function(err, newCampground){
                if(err){
                    console.log(err);
                }
                else {
                    console.log("Added a campground!");
                    //create a comment in each campground
                    Comment.create (
                        {
                        text: "This is my comment 1",
                        author: "Bob"
                        },
                        function(err, newComment){
                            if(err){
                                console.log(err);
                            }
                            else {
                                newCampground.comments.push(newComment);
                                newCampground.save();
                                console.log("Created a new comment");
                            }
                        }
                        );
                }
            });
        });
    });
    
}

module.exports = seedDB;
