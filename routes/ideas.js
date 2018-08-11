const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
    ensureAuthenticated
} = require('../helpers/auth');


// Load Idea Model
require('../models/idea');
const idea = mongoose.model('ideas');


// Ideas Page
router.get('/', ensureAuthenticated, (req, res) => {
    idea.find({
            user: req.user.id
        })
        .sort({
            date: 'desc'
        })
        .then((ideas) => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    idea.findOne({
        _id: req.params.id,
    }).then((idea) => {
        if (idea.user != req.user.id) {
            req.flash('error_msg', 'You are not authorized to edit other user\'s ideas');
            res.redirect('/ideas');
        } else {
            res.render('ideas/edit', {
                idea: idea
            });
        }

    })
});

// Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});


// Form Submission
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({
            text: 'Please add a title'
        });
    }
    if (!req.body.details) {
        errors.push({
            text: 'Please add some details'
        });
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        //console.log(req)
        const newVideoIdea = new idea({
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        });
        newVideoIdea.save()
            .then((newVideoIdea) => {
                req.flash('success_msg', 'Video Idea Added');
                res.redirect('/ideas')
            })
    }
});


// Edit Form Process
router.put('/:id', ensureAuthenticated, (req, res) => {
    idea.findOne({
            _id: req.params.id
        })
        .then((idea) => {
            // new values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then((idea) => {
                    req.flash('success_msg', 'Video Idea Updated');
                    res.redirect('/ideas');
                });
        });
});


router.delete('/:id', ensureAuthenticated, (req, res) => {
    idea.findOne({
        _id: req.params.id
    }).then((idea) => {
        idea.remove()
            .then(() => {
                req.flash('success_msg', 'Video Idea Deleted');
                res.redirect('/ideas');
            });
    });
});


module.exports = router;