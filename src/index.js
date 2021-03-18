const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { ApolloServer } = require("apollo-server");
const bodyPaser = require("body-parser");
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
  Verse
};

server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
