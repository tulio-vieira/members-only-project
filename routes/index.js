var express = require('express');
var router = express.Router();

// Require controller modules.
var index_controller = require('../controllers/indexController');

/* GET home page. */
router.get('/', index_controller.index_get);

// About page
router.get('/about', index_controller.about_get);

module.exports = router;