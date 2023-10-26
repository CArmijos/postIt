const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../model/user');

passport.use( 'local', new LocalStrategy( {
  usernameField:'correo'                                                                                                             
}, 
    async(correo,password, done) => {
        
        const user = await User.findOne({correo: correo}); 

        if(!user) {
            return done(null, false, req.flash('respuesta_fallo', 'Usuario No Existe...'));
        } else {
            const match = await user.match(password);      // user.match(password); 
            console.log(match);
            
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