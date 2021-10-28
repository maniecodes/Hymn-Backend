async function songs(parent, args, context) {
  try {
    const songs = context.prisma.hymn
      .findUnique({ where: { id: parent.id } })
      .songs();
    return songs;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  songs,
};
