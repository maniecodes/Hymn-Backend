async function hymn(parent, args, context, info) {
  id = parseInt(args.id);
  return await context.prisma.hymn.findUnique({
    where: { id: id },
  });
}

async function hymns(parent, args, context, info) {
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
}

async function song(parent, args, context, info) {
  id = parseInt(args.id);
  return await context.prisma.song.findUnique({
    where: { id: id },
  });
}

async function songs(parent, args, context, info) {
  const where = args.filter
    ? {
        OR: [
          { title: { contains: args.filter } },
          { description: { contains: args.filter } },
          {
            hymn: {
              title: { contains: args.filter },
              descriptoin: { contains: args.filter },
            },
          },
        ],
      }
    : {};

  const songs = await context.prisma.song.findMany({ where });
  const totalSongs = await context.prisma.song.count({ where });
  return { songs, totalSongs };
}

module.exports = {
  hymn,
  hymns,
  song,
  songs,
};
