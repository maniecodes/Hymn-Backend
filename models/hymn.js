const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hymnSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    songs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hymn", hymnSchema);
