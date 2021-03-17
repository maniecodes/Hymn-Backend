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

module.exports = {
  hymn,
  hymns,
};
