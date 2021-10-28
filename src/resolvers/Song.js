async function hymn(parent, args, context) {
  try {
    const hymn = await context.prisma.song
      .findUnique({ where: { id: parent.id } })
      .hymn();
    return hymn;
  } catch (error) {
    throw new Error(error);
  }
}

async function verses(parent, args, context) {
  try {
    const verses = await context.prisma.verse.findMany({
      where: { songId: parent.id },
    });
    return verses;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  hymn,
  verses,
};
