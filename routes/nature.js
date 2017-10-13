var express = require("express");
var router = express.Router();
var Nature = require("../models/nature.js");
var middleware = require("../middleware");
var request = require("request");

router.get("/photo",function(req, res){
    Nature.find({},function(err, alldata){
        if(err){
            console.log(err.message);
        }
        else{
            res.render("./nature/index.ejs", {data: alldata});            
        }
    });
});

router.post("/photo", middleware.isLoggedIn, function(req, res){
    request(req.body.photo.source, function(error, response, jsonbody){
        if(!error && response.statusCode === 200){
            Nature.create(req.body.photo, function(err, photo){
                if(err || !photo){
                    req.flash("error", "Error: Fail to create photo");
                    console.log(err.message);
                    res.redirect("/photo");
                }
                else {
                    photo.author.id = req.user._id;
                    photo.author.username = req.user.username;
                    photo.save();
                    req.flash("success", "Photo created");
                    res.redirect("/photo");                    
                }
            });            
        }
        else{
            req.flash("error", "Error: Invalid Img URL");
            res.redirect("/photo");            
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
            console.log(err.message);
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
            console.log(err.message);
            res.redirect("/photo");
        }
        else{
            res.render("./nature/edit.ejs", {photo:photo});
        }
    });

});


router.put("/photo/:id", middleware.checkNatureOwnership, function(req, res){
    Nature.findByIdAndUpdate(req.params.id, req.body.photo, function(err, photo){
        if(err || !photo){
            req.flash("error", "Error: Fail to update photo");
            console.log(err.message);
            res.redirect("/photo");
        }
        else{
            req.flash("success", "Photo updated");
            res.redirect("/photo/"+req.params.id); 
        }
    });
});

router.delete("/photo/:id", middleware.checkNatureOwnership, function(req, res){
    Nature.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Error: Fail to remove photo");
            console.log(err.message);
            res.redirect("/photo");
        }
        else{
            req.flash("success", "Photo deleted");
            res.redirect("/photo");
        }
    });
});

module.exports = router;
