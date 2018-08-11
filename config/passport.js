const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
const User = mongoose.model('users');


module.exports = function (passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {

        // Match User
        User.findOne({
            email: email
        }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect Email'
                });
            }

            // Math Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    console.log("Successfull Login");
                    return done(null, user, {
                        message: 'Successfull Login'
                    });
                } else {
                    return done(null, false, {
                        message: 'Password Incorrect'
                    });
                }
            })
        });
    }));

    passport.serializeUser(function (user, done) {
        return done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            return done(err, user);
        });
    });
}