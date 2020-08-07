// INDEX CONTROLLER
let Message = require("../models/message");

/* GET home page. */
exports.index_get = function(req, res, next) {
    Message.find({}).populate('user').exec((err, message_list) => {
        if (err) return next(err);
        res.render("home", { message_list });
    });
}

/* GET about page. */
exports.about_get = (req, res, next) => {
    res.render('about');
}