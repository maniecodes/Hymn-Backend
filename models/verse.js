const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const verseSchema = new Schema(
  {
    verses: [
      {
        type: String,
        required: true,
      },
    ],
    songs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Song",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Verse", verseSchema);
