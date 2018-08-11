const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const {
    ensureAuthenticated
} = require('../helpers/auth');

//  Load user model
require('../models/users');
const User = mongoose.model('users');

// User Login Route
router.get('/login', (req, res) => {
    res.render('users/login')
});


// User Register Route
router.get('/register', (req, res) => {
    res.render('users/register');
});


// Login Form Post
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


// Logout User
router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    req.flash('success_msg', 'You\'re logged out');
    res.redirect('/users/login')
})


// Register Form POST
router.post('/register', (req, res) => {
    let errors = [];

    if (req.body.password != req.body.password2) {
        errors.push({
            text: 'Password does not match'
        });
    }
    if (req.body.password.length < 4) {
        errors.push({
            text: 'Password must be atleast 4 characters'
        });
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    } else {
        User.findOne({
            email: req.body.email
        }).then((user) => {
            if (user) {
                errors.push({
                    text: 'Email already registered'
                })
                res.render('users/register', {
                    errors: errors,
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    password2: req.body.password2
                });
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });


                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then((newUser) => {
                                req.flash('sucess_msg', 'You are now registered');
                                res.redirect('/users/login');
                            })
                            .catch((err) => {
                                console.log(err);
                            })
                    })
                })
                console.log(newUser);
            }
        });
    }
});


module.exports = router;