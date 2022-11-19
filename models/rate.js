const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Rateschema = new Schema(
{
    nbrpeople:{
        type:Number,
        default:0,
    },
    rating:{
        type:Number,
        default:0,
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
      },

    
}


)
module.exports = mongoose.model("Rate", Rateschema);