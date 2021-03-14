const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const songSchema = new Schema(
  {
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
    hymnId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Hymn",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Song", songSchema);
