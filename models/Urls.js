const mongoose = require("mongoose");

let UrlSchema = new mongoose.Schema({
    originalUrl: {
        type:String,
        required: true,
    },
    slug: {
        type:String,
        required: true,
    },
}, {timestamps: true});

let URL = new mongoose.model("URL", UrlSchema)

module.exports = URL;