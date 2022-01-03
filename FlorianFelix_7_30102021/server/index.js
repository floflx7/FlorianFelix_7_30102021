const express = require("express");

const app = express();
const cors = require("cors");
var multer = require("multer");
const path = require("path");
require("dotenv").config();

app.use(express.json());
app.use(cors());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage }).single("file");

const db = require("./models");

// Routers
const postRouter = require("./routes/Posts");
app.use("/posts", upload, postRouter);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

app.use("/images", express.static(path.join(__dirname, "images")));

db.sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log("Server running on port 3001");
    });
  })
  .catch((err) => {
    console.log(err);
  });
