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
  hymn: async function ({ id }, req) {
    const hymn = await Hymn.findById(id);
    if (!hymn) {
      console.log("No hymn found");
    }
    return {
      ...hymn._doc,
      _id: hymn._id.toString(),
      createdAt: hymn.createdAt.toISOString(),
      updatedAt: hymn.updatedAt.toISOString(),
    };
  },
  updateHymn: async function ({ id, hymnInput }, req) {
    let { title, description, imageUrl } = hymnInput;
    const hymn = await Hymn.findById(id);
    if (!hymn) {
      console.log("No hymn found");
    }

    if (!title.length) {
      //errors.push({ message: "Title is required" });
      console.log("Title is required");
    }

    if (!description.length) {
      //errors.push({ message: "Description is required" });
      console.log("Description is required");
    }

    hymn.title = title;
    hymn.description = description;
    if (imageUrl !== "undefined") {
      hymn.imageUrl = imageUrl;
    }
    const updatedHymn = await hymn.save();
    return {
      ...updatedHymn._doc,
      _id: updatedHymn._id.toString(),
      createdAt: updatedHymn.createdAt.toISOString(),
      updatedAt: updatedHymn.updatedAt.toISOString(),
    };
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

      // TODO:: validate number
      // if (!number.length) {
      //   console.log("Number is required");
      //   errors.push({ message: "Number is required" });
      // }

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
  song: async function ({ id }, req) {
    const song = await Song.findById(id);
    if (!song) {
      console.log("No song found");
    }
    return {
      ...song._doc,
      _id: song._id.toString(),
      createdAt: song.createdAt.toISOString(),
      updatedAt: song.updatedAt.toISOString(),
    };
  },
  updateSong: async function ({ id, songInput }, req) {
    let { number, title, description, pdfUrl, mp3Url, hymnId } = songInput;
    title = title.trim();
    description = description.trim();
    hymnId = mongoose.Types.ObjectId(songInput.hymnId);

    //TODO::check current song number with the updated song number

    //Check if hymn exists
    const hymnExists = await Hymn.findById(hymnId);
    if (!hymnExists) {
      console.log("hymn does not exist");
      // errors.push({ message: "Hymn do not exist" });
    }

    const song = await Song.findById(id);
    if (!song) {
      console.log("No song found");
    }

    if (!title.length) {
      //errors.push({ message: "Title is required" });
      console.log("Title is required");
    }

    if (!description.length) {
      //errors.push({ message: "Description is required" });
      console.log("Description is required");
    }

    song.number = number;
    song.title = title;
    song.description = description;
    if (mp3Url !== "undefined") {
      song.mp3Url = mp3Url;
    }
    if (pdfUrl !== "undefined") {
      song.pdfUrl = pdfUrl;
    }
    const updatedSong = await song.save();
    return {
      ...updatedSong._doc,
      _id: updatedSong._id.toString(),
      createdAt: updatedSong.createdAt.toISOString(),
      updatedAt: updatedSong.updatedAt.toISOString(),
    };
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
  updateVerse: async function ({ id, verseInput }, req) {
    let { wording, refrain, songId } = verseInput;
    refrain = refrain.trim();
    songId = mongoose.Types.ObjectId(verseInput.songId);

    const verse = await Verse.findById(id);
    if (!verse) {
      console.log("No verse found");
    }

    //Check if song exists
    const songExists = await Song.findById(songId);
    if (!songExists) {
      console.log("Song does not exist");
    }
    verse.wording = wording;
    verse.refrain = refrain;
    verse.songId = songId;

    const updatedVerses = await verse.save();
    return {
      ...updatedVerses._doc,
      _id: updatedVerses._id.toString(),
      createdAt: updatedVerses.createdAt.toISOString(),
      updatedAt: updatedVerses.updatedAt.toISOString(),
    };
  },
};
