async function song(parent, args, context) {
  try {
    const song = await context.prisma.verse
      .findUnique({ where: { id: parent.id } })
      .song();
    return song;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  song,
};
