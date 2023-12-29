const router    = require("express").Router();
const User      = require("../model/user");
const passport  = require('passport');

/* Login del Usuario */
 router.get("/signin",(req,res) => {
  res.render("signin");
 });

/* Login Autenticacion para la aplicacion */
/**
 * @openapi
 * /signin/{cuenta, password}:
 *    post:
 *      tags:
 *        - Cuenta Y Contraseña para Autenticar
 *      parameters:
 *        - name: cuenta
 *        - name: password
 *      requestBody:
 *        required: true
 *    responses:
 *        200:
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  correo:
 *                    type: string
 *                    example: 'usuario@sistema.com'
 *                  password:
 *                    type: string
 *                    example: '******'
 */
router.post('/signin',  passport.authenticate('local',
    {
      successRedirect: '/registros',
      failureRedirect: '/signin',
      failureFlash: true 
    } ) );
                                                                
/* Usuarios a Registrarse */
 router.get("/signup",(req,res) => {
  res.render("signup");
 });

 router.route("/signup").post( async (req,res) => {
    // Obtiene Data del Formulario
    const {nombre, correo, password, confirma_password} = req.body;
    const errores = [];

    // Validación de Data
    if(nombre.length == 0 ) {
      errores.push({mensaje: 'Debe Ingresar Nombre Usuario...'});
    }

    if(correo.length == 0 ) {
      errores.push({mensaje: 'Debe Ingresar Correo Electrónico...'});
    }
                                     
    if(password != confirma_password) {
      errores.push({mensaje: 'Password no son coincidentes...'});
    }

    if(password.length < 8 ) {
      errores.push({mensaje: 'Password debe tener un largo a lo menos de 8 caracteres...'});
    }

    if( errores.length > 0 ) {
        // Existen errores en la validación
        res.render('signup', {errores,nombre, correo, password, confirma_password});
    } else { 
            // Valida no Exista el Correo Electrónico
            const correoUsr = await User.findOne({correo: correo});

            if( correoUsr ) {
                // El Correo ya existe
                req.flash('respuesta_fallo', 'Correo Electrónico ya se encuentra Registrado..');
                res.redirect('/signup');
            } else {
                // Todo Correcto, por tanto, Graba el Registro    
                const nuevoUsr = new User( {nombre, correo, password});
                nuevoUsr.password =  await nuevoUsr.encryptPassword(password);
                await nuevoUsr.save();

                req.flash('respuesta_ok', 'Ud., ya fue registrado(a) de forma exitosa...');
                res.redirect('/signin');
            }
    }

 });
 
module.exports = router;