var express = require('express');
var router = express.Router();

// Require controller modules.
var user_controller = require('../controllers/userController');

// USER ROUTES

// GET request for user detail.
router.get('/', user_controller.detail);

// GET request for creating a User.
router.get('/register', user_controller.register_get);

// POST request for creating a User.
router.post('/register', user_controller.register_post);

// GET request for log in.
router.get('/login', user_controller.login_get);

// POST request for login.
router.post('/login', user_controller.login_post);

// GET request for logout.
router.get('/logout', user_controller.logout_get);

// GET request for Membership.
router.get('/membership', user_controller.membership_get);

// POST request for Membership.
router.post('/membership', user_controller.membership_post);

// GET request for admin.
router.get('/admin', user_controller.admin_get);

// POST request for admin.
router.post('/admin', user_controller.admin_post);


module.exports = router;
