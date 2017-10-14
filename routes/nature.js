var express = require("express");
var router = express.Router();
var Nature = require("../models/nature.js");
var middleware = require("../middleware");
var request = require("request");
var geocoder = require("geocoder");

router.get("/photo",function(req, res){
      if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all campgrounds from DB
      Nature.find({title: regex}, function(err, data){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(data);
         }
      });
  } else {
      // Get all campgrounds from DB
      Nature.find({}, function(err, data){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(data);
            } else {
              res.render("./nature/index.ejs",{data: data, page:"home"});
            }
         }
      });
  }
});

router.post("/photo", middleware.isLoggedIn, function(req, res){
    request(req.body.photo.source, function(error, response, jsonbody){
        if(!error && response.statusCode === 200){
            var orgLocation=req.body.photo.location;
            var locationFound=false;
            geocoder.geocode(orgLocation, function(err, data){
                if(err || !data || data.status !== "OK"){
                    console.log(err);
                }
                else{
                    req.body.photo.lat = data.results[0].geometry.location.lat;
                    req.body.photo.lng = data.results[0].geometry.location.lng;
                    req.body.photo.location = data.results[0].formatted_address;
                    locationFound=true;
                }
                Nature.create(req.body.photo, function(errr, photo){
                    if(errr || !photo){
                        req.flash("error", "Error: Fail to create photo");
                        console.log(err);
                        res.redirect("/photo");
                    }
                    else {
                        photo.author.id = req.user._id;
                        photo.author.username = req.user.username;
                        photo.save();
                        if(!locationFound){
                            req.flash("warning", "Warning: Location not found");
                            res.redirect("/photo");                              
                        }
                        else{
                            req.flash("success", "Photo created");
                            res.redirect("/photo");                                     
                        }
                    }
                });                   

            });
                
        }
        else{
            req.flash("error", "Error: Invalid Img URL");
            res.redirect("/photo/new");            
        }
    });
});

router.get("/photo/new", middleware.isLoggedIn, function(req, res){
    res.render("./nature/new.ejs");
});

router.get("/photo/:id", function(req,res){
    Nature.findById(req.params.id).populate("comments").exec(function(err, photo){
        if(err || !photo){
            req.flash("error", "Error: Photo not found");
            console.log(err);
            res.redirect("/photo");
        }
        else{
            res.render("./nature/show.ejs", {photo: photo});
        }
    });
});

router.get("/photo/:id/edit", middleware.checkNatureOwnership, function(req, res){
    Nature.findById(req.params.id, function(err, photo){
        if(err || !photo){
            req.flash("error", "Error: Photo not found");
            console.log(err);
            res.redirect("/photo");
        }
        else{
            res.render("./nature/edit.ejs", {photo:photo});
        }
    });

});


router.put("/photo/:id", middleware.checkNatureOwnership, function(req, res){
    request(req.body.photo.source, function(error, response, jsonbody){
        if(!error && response.statusCode === 200){
            var orgLocation=req.body.photo.location;
            var locationFound = false;
            geocoder.geocode(orgLocation, function(err, data){
                if(err || !data || data.status !== "OK"){
                    console.log(err);
                }
                else{
                    req.body.photo.lat = data.results[0].geometry.location.lat;
                    req.body.photo.lng = data.results[0].geometry.location.lng;
                    req.body.photo.location = data.results[0].formatted_address;
                    locationFound = true;
                }
                Nature.findByIdAndUpdate(req.params.id, req.body.photo, function(err, photo){
                    if(err || !photo){
                        req.flash("error", "Error: Fail to update photo");
                        console.log(err);
                        res.redirect("/photo");
                    }
                    else if(!locationFound){
                        req.flash("warning", "Warning: Location not found");
                        res.redirect("/photo/"+req.params.id);
                    }
                    else{
                        req.flash("success", "Photo updated");
                        res.redirect("/photo/"+req.params.id);                        
                    }
                });                         

            });
                
        }
        else{
            req.flash("error", "Error: Invalid Img URL");
            res.redirect("/photo/"+req.params.id);            
        }
    });
});

router.delete("/photo/:id", middleware.checkNatureOwnership, function(req, res){
    Nature.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Error: Fail to remove photo");
            console.log(err);
            res.redirect("/photo");
        }
        else{
            req.flash("success", "Photo deleted");
            res.redirect("/photo");
        }
    });
});

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
