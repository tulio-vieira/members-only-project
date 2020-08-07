// import message model
let Message = require("../models/message");
let {isAuth, isAdmin} = require("./authMiddleware");
const { body, validationResult } = require('express-validator');

// MESSAGE CONTROLLER

// GET request for MESSAGE.
exports.message_create_get = [
    isAuth,
    (req, res, next) => {
        res.render('message-form');
    }
];

// POST request for MESSAGE.
exports.message_create_post = [
    isAuth,

    // FORM VALIDATION
    body('title').trim().isLength({ min: 1, max: 50}).withMessage('Title must not be empty or exceed 50 characters.'),
    body('text').trim().isLength({ min: 1, max: 500}).withMessage('Text must not be empty or exceed 500 characters.'),

    // SANITIZATION
    body('title').custom(getCustomValidator("Title has invalid characters")),
    body('text').custom(getCustomValidator("Text has invalid characters")),

    async (req, res, next) => {
        try {

            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                req.body.errors = errors.array();
                return res.render('message-form', req.body);
            }
            await new Message({
                user: req.user._id,
                title: req.body.title,
                text: req.body.text
            }).save();
            return res.redirect('/');

        } catch (err) {
            return next(err);
        }
    }
];

// GET request for deleting MESSAGE.
exports.message_delete_get = [
    isAdmin,
    async (req, res, next) => {
        try {
            let message = await Message.findById(req.params.id).populate('user');
            if(message) return res.render('message-delete', { message });
        } catch(err) {
            return next(err);
        }
    }
];

// DELETE(POST) request for deleting MESSAGE.
exports.message_delete_post = [
    isAdmin,
    async (req, res, next) => {
        try {
            await Message.findByIdAndRemove(req.body.messageId);
            return res.redirect('/');
        } catch(err) {
            return next(err);
        }
    }
];


function getCustomValidator(errMessage) {
    return (string) => {
        if (string.match(/[<>\\\/{}"`]/g)) {
            return Promise.reject(errMessage);
        } else {
            return true;
        }
    }
}