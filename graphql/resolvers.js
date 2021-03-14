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

      //save newly created hymn
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
      //Check if hymn exists
      const hymnExists = await Hymn.findById(hymnId);
      if (!hymnExists) {
        console.log("hymn does not exist");
        const error = new Error("Hymn do not exist");
        error.code = 401;
        throw error;
      }

      // Checks if song  exists
      const songList = await Song.find({
        number: number,
        hymnId: hymnId,
      });

      if (songList.length > 0) {
        console.log("song exists");
        return;
      }

      if (!title.length) {
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

      //Save newly created song
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
  createVerse: async function ({ verseInput }, req) {
    let { wording, refrain, songId } = verseInput;
    console.log(wording);
    refrain = refrain.trim();
    songId = mongoose.Types.ObjectId(verseInput.songId);
    console.log(songId);

    try {
      //Check if song exists
      const songExists = await Song.findById(songId);
      if (!songExists) {
        console.log("Song does not exist");
        const error = new Error("Song do not exist");
        error.code = 401;
        throw error;
      }

      //Check if there are verses associated to this song already
      const songList = await Verse.find({
        songId: songId,
      });
      if (songList.length > 0) {
        console.log("song exists");
        return;
      }

      if (!wording.length) {
        console.log("word is required");
      }

      if (!refrain.length) {
        console.log("refrain is required");
      }

      let verse = new Verse({
        wording,
        refrain,
        songId,
      });

      //save newly created verses
      const createdVerses = await verse.save();
      return {
        ...createdVerses._doc,
        _id: createdVerses._id.toString(),
        createdAt: createdVerses.createdAt.toISOString(),
        updatedAt: createdVerses.updatedAt.toISOString(),
      };
    } catch (error) {
      console.log(error);
    }
  },
};
