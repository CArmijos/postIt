const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
    },
    correo: {
      type: String,
      trim: true,
      required: true, 
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  }
);

//Encripta Contraseña
UserSchema.methods.encryptPassword = async(password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = bcrypt.hash(password, salt);
  return hash;
};

//Compara Contraseña Ingresada v/s Contraseña de Base de Datos
UserSchema.methods.matchPassword = async function(password){
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("user", UserSchema);