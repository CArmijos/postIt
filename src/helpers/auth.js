const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if( req.isAuthenticated()) {
        return next();
    } else {
        req.flash('respuesta_fallo', 'Usuario no está autorizado...');
        res.redirect('signin');
    }
}

module.exports = helpers;