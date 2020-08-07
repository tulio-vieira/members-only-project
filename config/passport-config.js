var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt = require('bcryptjs');
const passport = require('passport');
require('dotenv').config();

const verifyFunction = (username, password, done) => {
    // Search the MongoDB database for the user with the supplied username
    User.findOne({ username: username.toLowerCase() })
    .then( async (user) => {
        /**
         * The callback function expects two values: 1. Err and 2. User 
         * 
         * If we don't find a user in the database, that doesn't mean there is an application error,
         * so we use `null` for the error value, and `false` for the user value
         */
        if (!user) { return done(null, false, { message: 'User does not exist' }) }
        
        /**
         * Since the function hasn't returned, we know that we have a valid `user` object.  We then
         * validate the `user` object `hash` and `salt` fields with the supplied password using our 
         * utility function.  If they match, the `isValid` variable equals True.
         */
       
        const isValid = await bcrypt.compare(password, user.password);

        if (isValid) {
            // Since we have a valid user, we want to return no err and the user object
            return done(null, user);
        } else {
            // Since we have an invalid user, we want to return no err and no user
            return done(null, false,  { message: 'Password is incorrect' });
        }
    })
    .catch((err) => {   
        // This is an application error, so we need to populate the callback `err` field with it
        done(err);
    });
}

// Set up custom fields by passing a customFiled obj BEFORE the strategy. E.g. {username: "uname", password: "pword"}
const strategy = new LocalStrategy(verifyFunction);

// Tells Passport to use this strategy for the passport.authenticate() method
passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
    .then((user) => {
        done(null, user);
    })
    .catch(err => {
        done(err);
    })
});