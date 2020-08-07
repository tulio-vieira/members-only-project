var express = require('express');
var router = express.Router();

// Require controller module.
var message_controller = require('../controllers/messageController');

// MESSAGE ROUTES

/* GET message form. */
router.get('/create', message_controller.message_create_get);

// POST message
router.post('/create', message_controller.message_create_post);

// GET message delete
router.get('/delete/:id', message_controller.message_delete_get);

// DELETE message delete
router.post('/delete/:id', message_controller.message_delete_post);

module.exports = router;