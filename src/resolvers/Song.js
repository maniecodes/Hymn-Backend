function hymn(parent, args, context) {
  return context.prisma.song.findUnique({ where: { id: parent.id } }).hymn();
}


//TODO:: verses

module.exports = {
  hymn,
};
