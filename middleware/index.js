var Nature = require("../models/nature.js");
var Comment = require("../models/comment.js");

var middlewareObj={};

middlewareObj.checkNatureOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Nature.findById(req.params.id, function(err, nature){
            if(err || !nature){
                req.flash("error", "Error: Not found in our database");
                console.log(err);
                res.redirect("back");
            }
            else{
                if(nature.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err || !comment){
                req.flash("error", "Not found in our database");
                console.log(err);
                res.redirect("back");
            }
            else{
                if(comment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

module.exports = middlewareObj;