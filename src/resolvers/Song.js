function hymn(parent, args, context) {
  console.log("got here");
  console.log(parent);
  return context.prisma.song.findUnique({ where: { id: parent.id } }).link();
}

module.exports = {
  hymn,
};
