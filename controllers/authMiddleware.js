module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/user/login');
    }
}

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.admin) {
        return next();
    } else {
        res.status(401).render("not-authorized", {status: 401});
    }
}