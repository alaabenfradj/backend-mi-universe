const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ColorSchema = new Schema(
{
    face:{
        type: String,
        required: false
    },
    body:{
        type: String,
        required: false
    },
    chords:{
        type: String,
        required: false
    },
    upper:{
        type: String,
        required: false
    },
    circulos:{
        type: String,
        required: false
    },
    piano:{
        type: String,
        required: false
    },
    keys:{
        type: String,
        required: false
    },
    hinges:{
        type: String,
        required: false
    },
    stick:{
        type: String,
        required: false
    },
    product: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
    
})
module.exports = mongoose.model("Color", ColorSchema);