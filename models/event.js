const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema(
    {
        
        userToken: { type: String, required: true },
        
        ObjectID: 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
        eventType:{ type: String, required: true },
        eventName:{ type: String, required: true }

    },
    { timestamps: true }
);
module.exports = mongoose.model("event", EventSchema);