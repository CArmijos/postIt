const mongoose = require("mongoose");

const URI = "mongodb://127.0.0.1/postIT";

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    //useFindAndModify: false
  })
  .then((db) => console.log("Base de Datos Conectada....", db.connection.host))
  .catch((err) => console.error(err));

module.exports = mongoose;
