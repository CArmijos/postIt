const passport      = require('passport');
const bcrypt        = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../model/user');
const errores       = [];

passport.use( 'local', new LocalStrategy( {
  usernameField:'correo'                                                                                                             
}, 
    async(correo,password, done) => {

        const user = await User.findOne({correo: correo}); 

        if(user == null || !user ) {
            
            return done(null, false, {message: 'Usuario No Existe... Intente nuevamente...'});

        } else {
            const match = await user.matchPassword(password);

            if(match){
                return done(null, user);
            } else { 
                return done(null, false,{message: 'Password Incorrecta... Intente nuevamente...'});
            }
        }

}));

passport.serializeUser( (user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById( id, (err,user) => {
        done(null, user);
    })
});