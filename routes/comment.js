var express = require("express");
var router = express.Router();
var Nature = require("../models/nature.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware");

//Comment Route
router.get("/photo/:id/comment/new", middleware.isLoggedIn, function(req, res){
    Nature.findById(req.params.id, function(err, photo){
        if(err || !photo){
            req.flash("error", "Error: Photo not found");
            console.log(err);
            res.redirect("/photo");
        }
        else{
            res.render("./comment/new.ejs", {photo: photo});
        }
    });
});

router.post("/photo/:id/comment", middleware.isLoggedIn, function(req, res){
    Nature.findById(req.params.id, function(err, photo){
        if(err || !photo){
            req.flash("error", "Error: Photo not found");
            console.log(err);
            res.redirect("/photo");
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Error: Fail to create comment");
                    console.log(err);
                }
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    photo.comments.push(comment);
                    photo.save();
                    req.flash("success", "Comment created");
                    res.redirect("/photo/"+req.params.id);
                }
            });
        }
    });
});

router.get("/photo/:id/comment/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Nature.findById(req.params.id, function(err, photo){
        if(err || !photo){
            req.flash("error", "Error: Photo not found");
            console.log(err);
            res.redirect("/photo");
        }
        else{
            Comment.findById(req.params.comment_id, function(err, comment){
                if(err || !comment){
                    req.flash("error", "Error: Comment not found");
                    console.log(err);
                    res.redirect("/photo");
                }
                else{
                    res.render("./comment/edit.ejs", {photo: photo, comment: comment});
                }
            });
        }
    });
});

router.put("/photo/:id/comment/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Nature.findById(req.params.id, function(err, nature){
        if(err || !nature){
            req.flash("error", "Error: Photo not found");
            console.log(err);
            res.redirect("/photo");
        }
        else{
            Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
                if(err || !comment){
                    req.flash("error", "Error: Fail to update comment");
                    console.log(err);
                    res.redirect("/photo");
                }
                else{
                    req.flash("success", "Comment updated");
                    res.redirect("/photo/"+req.params.id);
                }
            });
        }
    });
});

router.delete("/photo/:id/comment/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Nature.findById(req.params.id, function(err, nature){
        if(err || !nature){
            req.flash("error", "Error: Photo not found");
            console.log(err);
            res.redirect("/photo");
        }
        else{
            Comment.findByIdAndRemove(req.params.comment_id, function(err){
                if(err){
                    req.flash("error", "Error: Fail to remove comment");
                    console.log(err);
                    res.redirect("/photo");
                }
                else{
                    req.flash("success", "Comment deleted");
                    res.redirect("/photo/"+req.params.id);
                }
            });            
        }
    });
});

module.exports = router;
