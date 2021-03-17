async function createHymn(parent, { hymnInput }, context, info) {
  let { title, description, imageUrl } = hymnInput;
  return await context.prisma.hymn.create({
    data: {
      title: title,
      description: description,
      imageUrl: imageUrl,
    },
  });
}

async function updateHymn(parent, { id, hymnInput }, context, info) {
  let { title, description, imageUrl } = hymnInput;
  id = parseInt(id);
  const hymn = await context.prisma.hymn.findUnique({
    where: { id: id },
  });
  if (!hymn) {
    console.log("No hymn found");
    return;
  }
  return await context.prisma.hymn.update({
    where: { id: id },
    data: { title: title, description: description, imageUrl: imageUrl },
  });
}

async function deleteHymn(parent, { id }, context, info) {
  id = parseInt(id);
  const hymn = await context.prisma.hymn.findUnique({
    where: { id: id },
  });
  if (!hymn) {
    console.log("No hymn found");
    return;
  }
  return await context.prisma.hymn.delete({ where: { id: id } });
}

module.exports = {
  createHymn,
  updateHymn,
  deleteHymn,
};
