const mongoose = require("mongoose");

const Hymn = require("../models/hymn");
const Song = require("../models/song");
const Verse = require("../models/verse");

module.exports = {
  createHymn: async function ({ hymnInput }, req) {
    const errors = [];
    let { title, description, imageUrl } = hymnInput;
    title = title.trim();
    description = description.trim();

    try {
      if (!title.length) {
        errors.push({ message: "Title is required" });
      }

      if (!description.length) {
        errors.push({ message: "Description is required" });
      }

      if (!imageUrl.length) {
        //TODO:: implement upload of default image
        console.log("upload a default image");
      }
      if (errors.length > 0) {
        const error = new Error("Invalid input.");
        error.data = errors;
        error.code = 422;
        throw error;
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
      error = new Error(error);
      error.code = 500;
      throw error;
    }
  },
  hymns: async function ({ page }, req) {
    try {
      if (!page) {
        page = 1;
      }

      const perPage = 10;
      const totalHymns = await Hymn.find().countDocuments();
      const hymns = await Hymn.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

      return {
        hymns: hymns.map((h) => {
          return {
            ...h._doc,
            _id: h._id.toString(),
            createdAt: h.createdAt.toISOString(),
            updatedAt: h.updatedAt.toISOString(),
          };
        }),
        totalHymns: totalHymns,
      };
    } catch (error) {
      console.log(error);
    }
  },
  createSong: async function ({ songInput }, req) {
    const errors = [];
    let { number, title, description, pdfUrl, mp3Url, hymnId } = songInput;
    title = title.trim();
    description = description.trim();
    hymnId = mongoose.Types.ObjectId(songInput.hymnId);

    try {
      //Check if hymn exists
      const hymnExists = await Hymn.findById(hymnId);
      if (!hymnExists) {
        console.log("hymn does not exist");
        errors.push({ message: "Hymn do not exist" });
      }

      // Checks if song  exists
      const songList = await Song.find({
        number: number,
        hymnId: hymnId,
      });

      if (songList.length > 0) {
        console.log("song exists");
        errors.push({ message: "Song exists already" });
      }

      if (!title.length) {
        console.log("Number is required");
        errors.push({ message: "Number is required" });
      }

      if (!title.length) {
        console.log("Title is required");
        errors.push({ message: "Title is required" });
      }

      if (!description.length) {
        console.log("description is required");
        errors.push({ message: "Description is required" });
      }

      if (errors.length > 0) {
        const error = new Error("Invalid input.");
        error.data = errors;
        error.code = 422;
        throw error;
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
      error = new Error(error);
      error.code = 500;
      throw error;
    }
  },
  songs: async function ({ page }, req) {
    try {
      if (!page) {
        page = 1;
      }

      const perPage = 10;
      const totalSongs = await Song.find().countDocuments();
      const songs = await Song.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

      return {
        songs: songs.map((s) => {
          return {
            ...s._doc,
            _id: s._id.toString(),
            createdAt: h.createdAt.toISOString(),
            updatedAt: h.updatedAt.toISOString(),
          };
        }),
        totalSongs: totalSongs,
      };
    } catch (error) {
      console.log(error);
    }
  },
  createVerse: async function ({ verseInput }, req) {
    const errors = [];
    let { wording, refrain, songId } = verseInput;
    refrain = refrain.trim();
    songId = mongoose.Types.ObjectId(verseInput.songId);

    try {
      //Check if song exists
      const songExists = await Song.findById(songId);
      if (!songExists) {
        console.log("Song does not exist");
        errors.push({ message: "Song do not exist" });
      }

      //Check if there are verses associated to this song already
      const songList = await Verse.find({
        songId: songId,
      });
      if (songList.length > 0) {
        console.log("song exists");
        errors.push({ message: "Song exists already" });
      }

      if (!wording.length) {
        errors.push({ message: "Wording is required" });
      }

      if (errors.length > 0) {
        const error = new Error("Invalid input.");
        error.data = errors;
        error.code = 422;
        throw error;
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
  verses: async function ({ id }, req) {
    try {
      const verses = await Verse.find({ songId: id }).populate("song").exec();
      return {
        verses: verses.map((v) => {
          return {
            ...v._doc,
            _id: v._id.toString(),
            createdAt: v.createdAt.toISOString(),
            updatedAt: v.updatedAt.toISOString(),
          };
        }),
        totalVerses: verses[0].wording.length,
      };
    } catch (error) {
      console.log(error);
    }
  },
};
