module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'you must be signed in first')
        return res.redirect('/login')
    }
    next()
}

module.exports.moveLastPageInfoToLocals = (req, res, next) => {
    if (req.session.lastPageInfo) {
        res.locals.lastPageInfo = req.session.lastPageInfo;
    }
    next();
}