module.exports = {
    isAdmin: function (req, res, next) {
        if (req.isAuthenticated() && req.user.isAdmin == 1) {
            next()
        }

        req.flash('error_msg', 'Necessária elevação. Apenas administradores.')
        res.redirect('/')
    }
}