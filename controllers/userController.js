// imports
let User = require("../models/user");
let Message = require("../models/message");
let { isAuth } = require("./authMiddleware");
let bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const passport = require("passport");
require("dotenv").config();

// USER CONTROLLER

// GET request for user detail.
exports.detail = [
    isAuth,
    (req, res, next) => {
        Message.find({ user: req.user._id }).exec((err, results) => {
            if (err) return next(err);
            res.locals.currentUser.message_count = results.length;
            return res.render('account-info');
        });
    }
];

// GET request for registering a User.
exports.register_get = (req, res, next) => {
    res.render('register-form');
}

// POST request for registering a User.
exports.register_post = [

    // FORM VALIDATION
    body('username').trim().isLength({ min: 1, max: 20}).withMessage('Username must not be empty or exceed 20 characters.')
    .isAlphanumeric().withMessage('Username has non-alphanumeric characters.'),
    body('password').isLength({ min: 1, max: 200}).withMessage('Password must not be empty or exceed 200 characters.'),

    // SANITIZATION (JUST IN CASE)
    body('username').escape(),

    async (req, res, next) => {
        try {
            //check if there are any errors in the form
            const errors = validationResult(req);
            req.body.errors = errors.isEmpty() ? [] : errors.array();
            let repeatedUser = await User.findOne({username: req.body.username.toLowerCase()});
            if (repeatedUser) req.body.errors.push({ msg: "Username already exists" });
            
            if (req.body.errors.length > 0) {
                return res.render('register-form', req.body);
            }

            let hashedPassword = await bcrypt.hash(req.body.password, 10);
            
            await new User({
                username: req.body.username.toLowerCase(),
                password: hashedPassword
            }).save();

            req.flash('info', "User successfully registered! Provide your credentials to login.");
            return res.redirect('/user/login');

        } catch (err) {
            return next(err);
        }
    }
];

// GET request for loging IN a User.
exports.login_get = (req, res, next) => {
    res.render('login-form');
}

// POST request for loging IN a User.
exports.login_post = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true
});

// GET request for loging OUT a User.
exports.logout_get = (req, res, next) => {
    req.logout();
    res.redirect('/');
}

// GET request for Membership.
exports.membership_get = [
    isAuth,
    (req, res, next) => {
        res.render('membership-form');
    }
];

// POST request for Membership.
exports.membership_post = [
    isAuth,
    async (req, res, next) => {
        let isMember = (req.body.membershipSecret.toLowerCase() === process.env.MEMBERSHIP_SECRET);
        if(isMember) {
            try {
                await User.findByIdAndUpdate(req.user._id, { member: true });
                return res.redirect('/user');
            } catch(err){
                return next(err);
            }
        }
        return res.render('membership-form', {error: "Incorrect Secret"});
    }
];

// GET request for Admin.
exports.admin_get = [
    isAuth,
    (req, res, next) => {
        res.render('admin-form');
    }
]

// POST request for admin.
exports.admin_post = [
    isAuth,
    async (req, res, next) => {
        let isAdmin = (req.body.adminSecret.toLowerCase() === process.env.ADMIN_SECRET);
        if(isAdmin) {
            try {
                await User.findByIdAndUpdate(req.user._id, { admin: true });
                return res.redirect('/user');
            } catch(err){
                return next(err);
            }
        }
        return res.render('admin-form', {error: "Incorrect Secret"});
    }
]