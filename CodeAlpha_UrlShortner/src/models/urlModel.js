import mongoose from "mongoose";

// Define the schema for storing original long URLs and their shortened codes
const urlSchema = new mongoose.Schema({
    // The original destination URL that needs to be shortened
    originalUrl: {
        type: String,
        required: true,
        trim: true
    },
    // The unique string code representing the shortened portion of the URL
    shortCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // The counter tracking the total number of redirects/clicks
    clicks: {
        type: Number,
        default: 0
    }
}, { timestamps: true }); // Automatically record createdAt and updatedAt timestamps

const Url = mongoose.model("Url", urlSchema);

export default Url;