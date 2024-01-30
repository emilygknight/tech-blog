const router = require('express').Router();
const { Blog, User } = require('../models');
// const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');

router.get("/", (req, res) => {
  Blog.findAll({
    include: [
      {
        model: User,
        attributes: ["name"],
      },
    ],
  })
    .then((BlogData) => {
      const blogs = BlogData.map((blog) => blog.get({ plain: true }));
      res.render("homepage", { blogs, loggedIn: req.session.loggedIn });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/blog/:id", (req, res) => {
  Blog.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "content", "title", "created_at"],
    include: 
      {
        model: User,
        attributes: ["username"],
      },
  })
    .then((BlogData) => {
      if (!BlogData) {
        res.status(404).json({ message: "No blog found with this id" });
        return;
      }
      const blog = BlogData.get({ plain: true });
      console.log(blog);
      res.render("single-blog", { blogs, loggedIn: req.session.loggedIn });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
