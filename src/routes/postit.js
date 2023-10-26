const router = require("express").Router();
const PostIT = require('../model/postit');
const { isAuthenticated } = require("../helpers/auth");

// Muestra Vista de Todos los Registros 
 router.get("/registros", isAuthenticated, async (req, res) => {
   const registros = await PostIT.find({user: req.user.id}).sort({fecha: 'desc'});
   res.render("postit_todos",{ registros }); 
 });

// Invoca Vista para Modificar un PostIT 
 router.get("/modificaNota/:id", isAuthenticated, async (req, res) => {
   const registro = await PostIT.findById( req.params.id );
   res.render("postit_modifica",{ registro });  
 });

 router.get("/agregarNota", isAuthenticated, (req, res) => {
   res.render("postit_agregar");
 });

 // Agrega Nota PostIT
 router.post('/postItAgregar', async (req,res) => {

   const {titulo, descripcion} = req.body;
   const errores = [];

   if( !titulo ) {
      errores.push({ mensaje: 'Debe ingresar titulo de PostIT...'});
   }
   if( !descripcion ) {
      errores.push({ mensaje: 'Debe ingresar descripcion de PostIT...'});
   }

   if( errores.length > 0 ) {
       res.render('postit_agregar', 
                  {
                     errores,
                     titulo,
                     descripcion,
                     user
                  });
   } else {    
      const postIT =  new PostIT({titulo, descripcion});
      postIT.user  =  req.user.id;
      await postIT.save();
      req.flash('respuesta_ok', "PostIt Agregado de forma satisfactoria...");
      res.redirect('/registros'); 
   }
   
 } );

 // Modifica el Registro de PostIT
 router.route("/modificaNota/:id" ).post( async (req,res)=> {
   
   const {titulo,descripcion} = req.body;

   await PostIT.findByIdAndUpdate(req.params.id, {titulo,descripcion} ) ;
   req.flash('respuesta_ok', "Registro de PostIt Modificado de forma satisfactoria...");
   res.redirect('/registros');

 });

 // Elimina el Registro de PostIT
 router.route("/eliminaNota/:id" ).post( async (req,res)=> {

   await PostIT.findByIdAndDelete( req.params.id );
   req.flash('respuesta_fallo', "Registro de PostIt Eliminado de forma satisfactoria...");
   res.redirect('/registros');

 });

module.exports = router;