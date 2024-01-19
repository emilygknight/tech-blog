const router = require("express").Router();
const sequelize = require("../config/connection");
const { Blog, User } = require("../models");
const withAuth = require("../../utils/auth");
router.get("/", withAuth, (req, res) => {
  Blog.findAll({
    where: {
      user_id: req.session.user_id,
    },
    attributes: ["id", "title", "content", "created_at"],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((BlogData) => {
      const blogs = BlogData.map((blog) => blog.get({ plain: true }));
      res.render("dashboard", { blogs, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
router.get("/edit/:id", withAuth, (req, res) => {
  Blog.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "content", "created_at"],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((BlogData) => {
      if (!BlogData) {
        res.status(404).json({ message: "No blog found with this id" });
        return;
      }

      const blog = BlogData.get({ plain: true });
      res.render("edit-blog", { blog, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
router.get("/new", (req, res) => {
  res.render("new-blog");
});

module.exports = router;