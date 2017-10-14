var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    methodOver  = require("method-override"),
    flash       = require("connect-flash"),
    mongoose    = require("mongoose"),
    session     = require("express-session"),
    passport    = require("passport"),
    LocalStrategy=require("passport-local"),
    Nature      = require("./models/nature.js"),
    Comment     = require("./models/comment.js"),
    User        = require("./models/user.js");
    
//Config
app.locals.moment=require("moment");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOver("_method"));
app.use(flash());
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASEURL,{useMongoClient: true});
//mongoose.connect("mongodb://localhost/yelpnature",{useMongoClient: true});
//mongoose.connect("mongodb://shanebacklight:239126LIxuanYI@ds119565.mlab.com:19565/inature",{useMongoClient: true});
//var seedDB      = require("./seed.js");
//seedDB();

//Passport Config
app.use(session({
    secret: "Snicker is the most beautiful dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Import Routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.warning = req.flash("warning");
    next();
});
app.use(require("./routes/nature.js"));
app.use(require("./routes/comment.js"));
app.use(require("./routes/index.js"));

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Start server"); 
});