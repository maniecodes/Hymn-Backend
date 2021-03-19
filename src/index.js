const { PrismaClient } = require("@prisma/client");
const express = require("express");
// const multer = require("multer");
// const { ApolloServer } = require("apollo-server");
const { ApolloServer } = require("apollo-server-express");
const { getUserId } = require("./utils");
const fs = require("fs");
const path = require("path");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Hymn = require("./resolvers/Hymn");
const Song = require("./resolvers/Song");
const Verse = require("./resolvers/Verse");

const prisma = new PrismaClient();

const resolvers = {
  Query,
  Mutation,
  Hymn,
  Song,
  Verse,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

const app = express();
app.set("port", process.env.PORT || 4000);
server.applyMiddleware({ app });

app.listen({ port: app.get("port") }, () =>
  console.log(
    `Server ready at http://...:${app.get("port")}${server.graphqlPath}`
  )
);
