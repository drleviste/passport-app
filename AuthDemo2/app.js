var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require('body-parser'),
    User                    = require("./models/user"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost:27017/auth_demo", {useNewUrlParser: true});

var app = express();
app.set("view engine", "ejs");

// need when posting data to request
app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
    secret: "Pass", //used to encode and decode session
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(__dirname + "/public"));

//===========
//Passport JS
//===========
// tell express to use passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// =========
// Routes
// =========
app.get("/", function(req, res){
    res.render("home");
})
// secret route
// run isLoggedIn first
app.get("/secret", isLoggedIn, (req,res) => {
    res.render("secret");
})


// ============
// Auth Routes
// ============

// show sign up form
app.get("/register", function(req, res){
    res.render("register");
});

// user signup
app.post("/register", function(req, res){
    // res.send("REGISTER POST ROUTE");

    // pass new user and pw
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });

});


// ============
// Login Routes
// ============
app.get("/login", function(req,res){
    res.render("login");
});

// middleware - runs before final route callback
app.post("/login", passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}),function(req,res){
});

app.get("/logout", (req,res) => {
    // res.send("I'll LOG YOU OUT :D");
    req.logout();
    res.redirect("/");
});

// middleware
function isLoggedIn(req,res,next) {
    // isAuthenticateed comes with passport
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, function(){
    console.log("Server started");
})

