const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const newHymn = await prisma.hymn.create({
    data: {
      title: "Fullstack tutorial for GraphQL",
      description: "www.howtographql.com",
    },
  });
  const allHymns = await prisma.hymn.findMany();
  
  
 
  console.log(allHymns);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
