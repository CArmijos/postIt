/* Requiere Librerias */
const express   = require("express");
const bodyParser= require("body-parser");
const path      = require("path");
const {create}  = require("express-handlebars");
const session   = require("express-session");
const flash     = require("connect-flash");
const passport  = require('passport');
const {swaggerDocs} = require('./swagger.js');

/* Inicializa Express y Handlebars(Plantilla para Vistas)*/
const app       = express();
const hbs       = create(
    {   defaultLayout: 'main',
        extname: '.hbs',
        layoutsDir: __dirname + '/views/layouts/',
        partialsDir: __dirname + '/views/partials/',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
    } );
    
/* define Constantes */
const PORT      = 3100;
const api       = require("./routes/index");
const postit    = require("./routes/postit");
const users     = require("./routes/users");

/* Configuraciones */
require('./config/passport');

/* Middleware */
app.use('/images', express.static('public'));
app.use(express.static( __dirname + "/public"));
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );

app.use( session( {
                    secret: "escalab",
                    resave: true,
                    saveUninitialized: true
                    }
                )
        );
app.use( passport.initialize());
app.use( passport.session());
app.use( flash());

// Variables Globales
app.use( (req, res, next )=> {
    res.locals.respuesta_ok     = req.flash('respuesta_ok');
    res.locals.respuesta_fallo  = req.flash('respuesta_fallo');
    res.locals.error            = req.flash('error');
    res.locals.user             = req.user || null;
    console.log(res.locals.user);
    next();
});

/* Rutas */
app.use("/", api); 
app.use("/", postit);
app.use("/", users);

/* Seteos */
app.engine('hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', __dirname + '/views');
 
/* Conecta con Base de Datos... */
require('./database.js');

/* Puerto a la escucha... */
app.listen(PORT, function(err){
    if (err) console.log("🔊  Error en configuración del Server");
    console.log("💻 Server a la escucha en Port", PORT);
    swaggerDocs(app, PORT);
});