const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostItSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    }, 
    fecha:{
     type: Date,
     default: Date.now
    },
  }

);

module.exports = mongoose.model("postit", PostItSchema);

