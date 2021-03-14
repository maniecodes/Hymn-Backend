const mongoose = require("mongoose");

const Hymn = require("../models/hymn");
const Song = require("../models/song");
const Verse = require("../models/verse");

module.exports = {
  createHymn: async function ({ hymnInput }, req) {
    let { title, description, imageUrl } = hymnInput;
    title = title.trim();
    description = description.trim();

    try {
      if (!title.length) {
        console.log("Title is required");
      }

      if (!description.length) {
        console.log("description is required");
      }

      if (!imageUrl.length) {
        console.log("upload a default image");
      }

      const hymn = new Hymn({
        title: title,
        description: description,
        imageUrl: imageUrl,
      });

      //save hymn
      const createdHymn = await hymn.save();

      return {
        ...createdHymn._doc,
        _id: createdHymn._id.toString(),
        createdAt: createdHymn.createdAt.toISOString(),
        updatedAt: createdHymn.updatedAt.toISOString(),
      };
    } catch (error) {
      console.log(error);
    }
  },
  createSong: async function ({ songInput }, req) {
    let { number, title, description, pdfUrl, mp3Url, hymnId } = songInput;
    title = title.trim();
    description = description.trim();
    hymnId = mongoose.Types.ObjectId(songInput.hymnId);

    try {
      const hymnExists = await Hymn.findById(hymnId);
      if (!hymnExists) {
        console.log("hymn does not exist");
        const error = new Error("Hymn do not exist");
        error.code = 401;
        throw error;
      }

      const songList = await Song.find({
        number: number,
        hymnId: hymnId,
      });
      // Checks if song already exists
      if (songList.length > 0) {
        console.log("song exists");
        return;
      }

      if (!title.number) {
        console.log("Number is required");
      }

      if (!title.length) {
        console.log("Title is required");
      }

      if (!description.legth) {
        console.log("description is required");
      }

      let song = new Song({
        number,
        title,
        description,
        pdfUrl,
        mp3Url,
        hymnId,
      });

      const createdSong = await song.save();
      return {
        ...createdSong._doc,
        _id: createdSong._id.toString(),
        createdAt: createdSong.createdAt.toISOString(),
        updatedAt: createdSong.updatedAt.toISOString(),
      };
    } catch (error) {
      console.log(error);
    }
  },
};
