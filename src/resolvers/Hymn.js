function songs(parent, args, context) {
  return context.prisma.hymn.findUnique({ where: { id: parent.id } }).songs();
}

module.exports = {
  songs,
};
