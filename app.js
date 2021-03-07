const express = require("express");
const bodyPaser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyPaser.json());

mongoose
  .connect("mongodb+srv://root:Zamanie93@cluster0.jb1bo.mongodb.net/hymndb", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
