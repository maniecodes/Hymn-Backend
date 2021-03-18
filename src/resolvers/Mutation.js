async function createHymn(parent, { hymnInput }, context, info) {
  let { title, description, imageUrl } = hymnInput;
  return await context.prisma.hymn.create({
    data: {
      title: title,
      description: description,
      imageUrl: imageUrl,
    },
  });
}

async function updateHymn(parent, { id, hymnInput }, context, info) {
  let { title, description, imageUrl } = hymnInput;
  id = parseInt(id);
  const hymn = await context.prisma.hymn.findUnique({
    where: { id: id },
  });
  if (!hymn) {
    console.log("No hymn found");
    return;
  }
  return await context.prisma.hymn.update({
    where: { id: id },
    data: { title: title, description: description, imageUrl: imageUrl },
  });
}

async function deleteHymn(parent, { id }, context, info) {
  id = parseInt(id);
  const hymn = await context.prisma.hymn.findUnique({
    where: { id: id },
  });
  if (!hymn) {
    console.log("No hymn found");
    return;
  }
  return await context.prisma.hymn.delete({ where: { id: id } });
}

async function createSong(parent, { songInput }, context, info) {
  let {
    number,
    title,
    description,
    pdfUrl,
    mp3Url,
    referain,
    hymnId,
  } = songInput;
  hymnId = parseInt(hymnId);
  number = parseInt(number);
  console.log(parent);

  //Check if hymn exists
  const hymnExists = await context.prisma.hymn.findUnique({
    where: {
      id: hymnId,
    },
  });

  if (!hymnExists) {
    console.log("hymn does not exist");
    return;
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
    console.log(`Song associated with hymn ${hymnId} exists already`);
    return;
  }
  return await context.prisma.song.create({
    data: {
      number: number,
      title: title,
      description: description,
      hymn: { connect: { id: hymnId } },
      pdfUrl: pdfUrl,
      mp3Url: mp3Url,
      referain: referain,
    },
  });
}

async function updateSong(parent, { id, songInput }, context, info) {
  let {
    number,
    title,
    description,
    pdfUrl,
    mp3Url,
    referain,
    hymnId,
  } = songInput;
  hymnId = parseInt(hymnId);
  number = parseInt(number);
  id = parseInt(id);
  console.log(id);

  const hymnExists = await context.prisma.hymn.findUnique({
    where: { id: hymnId },
  });
  const songExits = await context.prisma.song.findUnique({
    where: { id: id },
  });

  if (!hymnExists) {
    console.log("hymn does not exist");
    return;
  }

  if (!songExits) {
    console.log("No song found");
    return;
  }
  return await context.prisma.song.update({
    where: { id: id },
    data: {
      number: number,
      title: title,
      description: description,
      pdfUrl: pdfUrl,
      mp3Url: mp3Url,
      referain: referain,
      hymnId: hymnId,
    },
  });
}
async function deleteSong(parent, { id }, context, info) {
  id = parseInt(id);
  const song = await context.prisma.song.findUnique({
    where: { id: id },
  });
  if (!song) {
    console.log("No song found");
    return;
  }
  return await context.prisma.song.delete({ where: { id: id } });
}

async function createVerse(parent, { verseInput }, context, info) {
  let { wording, songId } = verseInput;
  songId = parseInt(songId);

  //Check if song exists
  const songExists = await context.prisma.song.findUnique({
    where: {
      id: songId,
    },
  });

  if (!songExists) {
    console.log("song does not exist");
    return;
  }

  return await context.prisma.verse.create({
    data: {
      wording: wording,
      song: { connect: { id: songId } },
    },
  });
}
async function updateVerse(parent, { id, verseInput }, context, info) {
  let { wording, songId } = verseInput;
  id = parseInt(id);
  songId = parseInt(songId);

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
    console.log("song does not exist");
    return;
  }

  if (!verseExits) {
    console.log("No verse found");
    return;
  }
  return await context.prisma.verse.update({
    where: { id: id },
    data: {
      wording: wording,
      songId: songId,
    },
  });
}
async function deleteVerse(parent, { id }, context, info) {
  id = parseInt(id);
  const verse = await context.prisma.verse.findUnique({
    where: { id: id },
  });
  if (!verse) {
    console.log("No verse found");
    return;
  }
  return await context.prisma.verse.delete({ where: { id: id } });
}

module.exports = {
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
