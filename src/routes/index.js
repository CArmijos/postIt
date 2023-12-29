const router = require("express").Router();
const PostIT = require('../model/postit');
const { isAuthenticated } = require("../helpers/auth");

/* Página Principal */
router.route("/" ).get((req,res)=> {
   res.render("main");
});

/* Página quienes somos */ 
/**
 * @openapi
 * /examen:
 *    get:
 *      tags:
 *        - examen
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
router.route("/examen" ).get((req,res)=> {
    res.render("examen");
 });


 /* Logout */
 /**
 * @openapi
 * /logout:
 *    get:
 *      tags:
 *        - Logout
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
 router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});



 module.exports = router;


