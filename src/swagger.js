const swaggerJSDoc  = require('swagger-jsdoc');
const swaggerUI     = require('swagger-ui-express');

// Información del Metadata de la API
const options = {
    definition: {
        openapi: "3.0.0",
        servers:[{url: "http:/localhost/3100"}],
        info: { title: "Examen Curso NodeJS", 
                version: "1.0.0"},
    },
    apis: [ "./src/routes/*.js"]    ,
};

// Docs en Formato JSON
const swaggerSpec = swaggerJSDoc(options);

// Funcion para Setup del Documento
const swaggerDocs = ( app, port ) => {
    app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    app.get('/docs.json', (req,res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    console.log(`👓 La versión Nº1 esta disponible en el siguiente link http://localhost:${port}/docs`);
};

module.exports = {swaggerDocs};