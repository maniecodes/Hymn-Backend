const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const verseSchema = new Schema(
  {
    wording: [
      {
        type: String,
        required: true,
      },
    ],
    song: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Song",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Verse", verseSchema);
