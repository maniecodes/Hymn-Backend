const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateUser, singleUpload } = require("../utils");

async function createHymn(parent, { hymnInput }, context, info) {
  let { title, description, imageUrl } = hymnInput;
  try {
    await validateUser(context);

    const createdHymn = await context.prisma.hymn.create({
      data: {
        title: title,
        description: description,
        imageUrl: imageUrl,
      },
    });

    return createdHymn;
  } catch (error) {
    throw new Error(error);
  }
}

async function updateHymn(parent, { id, hymnInput }, context, info) {
  let { title, description, imageUrl } = hymnInput;
  try {
    if (id <= 0 || id === undefined) {
      throw new Error("Invalid parameter");
    }

    id = parseInt(id);

    await validateUser(context);

    const hymn = await context.prisma.hymn.findUnique({
      where: { id: id },
    });

    if (!hymn) {
      throw new Error("No hymn found");
    }

    const updatedHymn = await context.prisma.hymn.update({
      where: { id: id },
      data: { title: title, description: description, imageUrl: imageUrl },
    });

    return updatedHymn;
  } catch (error) {
    throw new Error(error);
  }
}

async function deleteHymn(parent, { id }, context, info) {
  try {
    if (id <= 0 || id === undefined) {
      throw new Error("Invalid parameter");
    }
    id = parseInt(id);

    await validateUser(context);

    const hymn = await context.prisma.hymn.findUnique({
      where: { id: id },
    });
    if (!hymn) {
      throw new Error("No hymn found");
    }
    const deletedHymn = await context.prisma.hymn.delete({ where: { id: id } });

    return deletedHymn;
  } catch (error) {
    throw new Error(error);
  }
}

async function createSong(parent, { songInput }, context, info) {
  let {
    number,
    title,
    description,
    pdfFile,
    mp3File,
    referain,
    hymnId,
  } = songInput;
  let filePath;
  let pfdFileUrl = null;
  let musicFileUrl = null;

  try {
    hymnId = parseInt(hymnId);
    number = parseInt(number);

    await validateUser(context);

    if (pdfFile !== undefined) {
      filePath = "pdf";
      pfdFileUrl = await singleUpload(pdfFile, filePath);
    }

    if (mp3File !== undefined) {
      filePath = "music";
      musicFileUrl = await singleUpload(pdfFile, filePath);
    }

    //Check if hymn exists
    const hymnExists = await context.prisma.hymn.findUnique({
      where: {
        id: hymnId,
      },
    });

    if (!hymnExists) {
      throw new Error("Hymn already exists");
    }

    //Check if song exists for the particular hymn
    const songExists = await context.prisma.song.findMany({
      where: {
        AND: [
          {
            number: {
              equals: number,
            },
          },
          {
            hymnId: {
              equals: hymnId,
            },
          },
        ],
      },
    });

    if (songExists.length > 0) {
      throw new Error(`Song associated with hymn ${hymnId} exists already`);
    }

    const createdSong = await context.prisma.song.create({
      data: {
        number: number,
        title: title,
        description: description,
        hymn: { connect: { id: hymnId } },
        pdfUrl: pfdFileUrl,
        mp3Url: musicFileUrl,
        referain: referain,
      },
    });
    return createdSong;
  } catch (error) {
    throw new Error(error);
  }
}

async function updateSong(parent, { id, songInput }, context, info) {
  let {
    number,
    title,
    description,
    pdfFile,
    mp3File,
    referain,
    hymnId,
  } = songInput;
  let filePath;
  let pfdFileUrl = null;
  let musicFileUrl = null;

  try {
    hymnId = parseInt(hymnId);
    number = parseInt(number);
    id = parseInt(id);
    console.log(id);

    await validateUser(context);
    if (pdfFile !== undefined) {
      filePath = "pdf";
      pfdFileUrl = await singleUpload(pdfFile, filePath);
    }

    if (mp3File !== undefined) {
      filePath = "music";
      musicFileUrl = await singleUpload(pdfFile, filePath);
    }

    const hymnExists = await context.prisma.hymn.findUnique({
      where: { id: hymnId },
    });
    const songExists = await context.prisma.song.findUnique({
      where: { id: id },
    });

    if (!hymnExists) {
      throw new Error("No hymn found");
    }

    if (!songExists) {
      throw new Error("No song found");
    }
    const updatedSong = await context.prisma.song.update({
      where: { id: id },
      data: {
        number: number,
        title: title,
        description: description,
        pdfUrl: pfdFileUrl,
        mp3Url: musicFileUrl,
        referain: referain,
        hymnId: hymnId,
      },
    });
    return updatedSong;
  } catch (error) {
    throw new Error(error);
  }
}

async function deleteSong(parent, { id }, context, info) {
  try {
    id = parseInt(id);

    await validateUser(context);

    const songExists = await context.prisma.song.findUnique({
      where: { id: id },
    });
    if (!songExists) {
      throw new Error("No song found");
    }
    const deletedSong = await context.prisma.song.delete({ where: { id: id } });
    return deletedSong;
  } catch (error) {
    throw new Error(error);
  }
}

async function createVerse(parent, { verseInput }, context, info) {
  let { wording, songId } = verseInput;
  try {
    songId = parseInt(songId);

    await validateUser(context);

    //Check if song exists
    const songExists = await context.prisma.song.findUnique({
      where: {
        id: songId,
      },
    });

    if (!songExists) {
      throw new Error("No song found");
    }
    const createdVerse = await context.prisma.verse.create({
      data: {
        wording: wording,
        song: { connect: { id: songId } },
      },
    });

    return createdVerse;
  } catch (error) {
    throw new Error(error);
  }
}

async function updateVerse(parent, { id, verseInput }, context, info) {
  let { wording, songId } = verseInput;
  try {
    id = parseInt(id);
    songId = parseInt(songId);

    await validateUser(context);

    //Check if song exists
    const songExists = await context.prisma.song.findUnique({
      where: {
        id: songId,
      },
    });

    // Check if verse exists
    const verseExits = await context.prisma.verse.findUnique({
      where: { id: id },
    });

    if (!songExists) {
      throw new Error("No song found");
    }

    if (!verseExits) {
      throw new Error("No verse found");
    }
    const updatedVerse = await context.prisma.verse.update({
      where: { id: id },
      data: {
        wording: wording,
        songId: songId,
      },
    });
    return updatedVerse;
  } catch (error) {
    throw new Error(error);
  }
}

async function deleteVerse(parent, { id }, context, info) {
  try {
    id = parseInt(id);

    await validateUser(context);

    const verse = await context.prisma.verse.findUnique({
      where: { id: id },
    });
    if (!verse) {
      console.log("No verse found");
      return;
    }
    const deletedVerse = await context.prisma.verse.delete({
      where: { id: id },
    });
    return deletedVerse;
  } catch (error) {
    throw new Error(error);
  }
}

async function signup(parent, args, context, info) {
  try {
    const password = await bcrypt.hash(args.password, 10);
    const user = await context.prisma.user.create({
      data: { ...args, password },
    });

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    return {
      token,
      user,
    };
  } catch (error) {
    throw new Error(error);
  }
}

async function login(parent, args, context, info) {
  try {
    const user = await context.prisma.user.findUnique({
      where: { email: args.email },
    });

    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid || !user) {
      throw new Error("Invalid user/password");
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    return {
      token,
      user,
    };
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  signup,
  login,
  createHymn,
  updateHymn,
  deleteHymn,
  createSong,
  updateSong,
  deleteSong,
  createVerse,
  updateVerse,
  deleteVerse,
};
