async function hymn(parent, args, context, info) {
  try {
    id = parseInt(args.id);

    const hymn = await context.prisma.hymn.findUnique({
      where: { id: id },
    });

    return hymn;
  } catch (error) {
    throw new Error(error);
  }
}

async function hymns(parent, args, context, info) {
  try {
    const where = args.filter
      ? {
          OR: [
            { title: { contains: args.filter } },
            { description: { contains: args.filter } },
          ],
        }
      : {};

    const hymns = await context.prisma.hymn.findMany({ where });
    const totalHymns = await context.prisma.hymn.count({ where });
    return { hymns, totalHymns };
  } catch (error) {
    throw new Error(error);
  }
}

async function song(parent, args, context, info) {
  try {
    id = parseInt(args.id);
    return await context.prisma.song.findUnique({
      where: { id: id },
    });
  } catch (error) {
    throw new Error(error);
  }
}

async function songs(parent, args, context, info) {
  try {
    const where = args.filter
      ? {
          OR: [
            { title: { contains: args.filter } },
            { description: { contains: args.filter } },
            {
              hymn: {
                title: { contains: args.filter },
                description: { contains: args.filter },
              },
            },
          ],
        }
      : {};

    const songs = await context.prisma.song.findMany({ where });
    const totalSongs = await context.prisma.song.count({ where });
    return { songs, totalSongs };
  } catch (error) {
    throw new Error(error);
  }
}
async function verse(parent, args, context, info) {
  try {
    id = parseInt(args.id);
    const verse = await context.prisma.verse.findUnique({
      where: { id: id },
    });
    return verse;
  } catch (error) {
    throw new Error(error);
  }
}
async function verses(parent, args, context, info) {
  try {
    const where = args.filter
      ? {
          OR: [
            { wording: { contains: args.filter } },
            {
              song: {
                title: { contains: args.filter },
                description: { contains: args.filter },
              },
            },
          ],
        }
      : {};

    const verses = await context.prisma.verse.findMany({ where });
    const totalVerses = await context.prisma.verse.count({ where });
    return { verses, totalVerses };
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  hymn,
  hymns,
  song,
  songs,
  verse,
  verses,
};
