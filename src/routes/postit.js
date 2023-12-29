const router = require("express").Router();
const PostIT = require('../model/postit');
const { isAuthenticated } = require("../helpers/auth");

/**
 * @swagger
 * components:
 *  schemas:
 *    PostIt:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: AutoGenerador de Id para los PostIT
 *        titulo:
 *          type: string
 *          description: Titulo del PostIT
 *        descripcion:
 *          type: string
 *          description: Describe la Tarea a realizar y registrada en el PostIT
 *        user:
 *          type: string
 *          description: Usuario Dueño del PostIT
 *        fecha:
 *          type: date
 *          description: Fecha Creaci{on del PostIT}
 *      required:
 *        - titulo
 *        - descripcion
 *        - user
 *        - fecha
 *      example:
 *        id: gQBOyGbxcQy6tEp0aZ78X
 *        titulo: Construcción de Proyecto PostIT
 *        descripcion: Tengo que construir documentación del proyecto
 *        user: 1
 *        fecha: 2023-11-14
 *    TaskNotFound:
 *      type: object
 *      properties:
 *        msg:
 *          type: string
 *          description: El Post Solicitado no fue encontrado...
 *      example:
 *        msg: Post no Encontrado...
 *
 *  parameters:
 *    Id:
 *      in: path
 *      name: id
 *      required: true
 *      schema:
 *        type: string
 *      description: Id que Identifica el PostIt
 */

// Muestra Vista de Todos los Registros 
/**
 * @swagger
 * tags:
 *  name: Post
 *  description: Post Endpoint
 */

/**
 * @swagger
 * /registros:
 *  get:
 *    summary: Returns a list of tasks
 *    tags: [Post]
 *    responses:
 *      200:
 *        description: Muestra todos los PostIT
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/PostIt'
 */
router.get("/registros", isAuthenticated, async (req, res) => {
  const registros = await PostIT.find({user: req.user.id}).sort({fecha: 'desc'});
  res.render("postit_todos",{ registros }); 
});

// Invoca Vista para Modificar un PostIT 
/**
 * @openapi
 * /modificaNota:
 *    get:
 *      tags:
 *        - Obtiene un PostIT para Modificar
 *    responses:
 *        200:
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: ok
 *                  data:
 *                    type: array
 *                    items:
 *                      type: object
 */
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