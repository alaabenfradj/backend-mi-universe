const mongoose = require("mongoose");
const mongooseAlgolia = require("mongoose-algolia");
const PaimentSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: { type: Number, required: true },
        paymentId: { type: String, required: true },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
        ],

    },
    { timestamps: true }
);
PaimentSchema.plugin(mongooseAlgolia, {
    appId: "1RY92FSHMF",
    apiKey: "2a5deb3323c4edb2ecbcc46687c2c216",
    indexName: "paiements", //The name of the index in Algolia, you can also pass in a function
    selector: "-likesCount", //You can decide which field that are getting synced to Algolia (same as selector in mongoose)
    populate: [{
      path:"products",
      ref:"Product"
    }],
      
    defaults: {
      author:   PaimentSchema.customer,
    },
    mappings: {
      title: function(value) {
        return ` ${value}`
      },
    },
    virtuals: {
      whatever: function(doc) {
        return `Custom data ${doc.title}`
      },
    },
    filter: function (doc) {
      return !doc.softdelete;
    },
    debug: true, // Default: false -&gt; If true operations are logged out in your console
  });
  let Model = mongoose.model("Paiment",PaimentSchema );
  Model.SyncToAlgolia(); //Clears the Algolia index for this schema and synchronizes all documents to Algolia (based on the settings defined in your plugin settings)
  Model.SetAlgoliaSettings({
    searchableAttributes: [], //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
  });

module.exports = mongoose.model("Paiment", PaimentSchema);
