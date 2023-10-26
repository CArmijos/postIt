const router = require("express").Router();

/* Página Principal */
router.route("/" ).get((req,res)=> {
  //res.send( "Página de Inicio PostIT..."  ) ; 
   res.render("main");
});

/* Página quines somos */ 
router.route("/examen" ).get((req,res)=> {
    res.render("examen");
 });


 /* Logout */
 router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

 module.exports = router;


