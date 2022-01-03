const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const fs = require("fs");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Likes] });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});

router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
  });
  res.json(listOfPosts);
});

router.post("/", async (req, res) => {
  const post = req.body;

  if (req.file) {
    await Posts.create({
      title: req.body.title,
      postText: req.body.postText,
      image: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      username: req.body.username,
      UserId: req.body.userId,
    });
  } else {
    await Posts.create({
      title: req.body.title,
      postText: req.body.postText,
      username: req.body.username,
      UserId: req.body.userId,
    });
  }

  res.json(post);
});

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  Posts.destroy({
    where: {
      id: postId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
