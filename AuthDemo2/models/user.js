var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// define userSchema

var UserSchema = new mongoose.Schema({
    usename: String,
    password: String
});

// add methods to UserSchema
// passportlocalmongoose has serializer already
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema)
