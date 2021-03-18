function song(parent, args, context) {
  return context.prisma.verse.findUnique({ where: { id: parent.id } }).song();
}

module.exports = {
  song,
};
