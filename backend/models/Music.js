const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MusicSchema = new Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    filename: { type: String, required: true },
    musicType: { type: String, enum: ['reggae', 'hiphop', 'pop' , 'rock' , 'Other'], required: true }, 
    uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Music", MusicSchema);
