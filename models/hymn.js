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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hymn", hymnSchema);
