const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const songSchema = new Schema({
  number: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pdfUrl: {
    type: String,
  },
  mp3Url: {
    type: String,
  },
  verses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Verse",
    },
  ],
});

module.exports = mongoose.model("Song", songSchema);
