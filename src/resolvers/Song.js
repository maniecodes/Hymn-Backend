function hymn(parent, args, context) {
  return context.prisma.song.findUnique({ where: { id: parent.id } }).hymn();
}

function verses(parent, args, context) {
  return context.prisma.verse.findMany({ where: { songId: parent.id } });
}

module.exports = {
  hymn,
  verses,
};
