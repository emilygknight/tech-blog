const router = require('express').Router();
const { Blog , User } = require('../../models');
const withAuth = require('../../utils/auth');
const sequelize = require('../../config/connection');

router.get('/', (req, res) => {
  console.log('======================');
  Post.findAll({
          attributes: ['id',
              'title',
              'content',
              'created_at'
          ],
          order: [
              ['created_at', 'DESC']
          ],
          include: {
                  model: User,
                  attributes: ['username']
              },
      })
      .then(BlogData => res.json(BlogData.reverse()))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });

});
router.get('/:id', (req, res) => {
  Blog.findOne({
          where: {
              id: req.params.id
          },
          attributes: ['id',
              'content',
              'title',
              'created_at'
          ],
          include: {
                  model: User,
                  attributes: ['username']
              },
      })
      .then(BlogData => {
          if (!BlogData) {
              res.status(404).json({ message: 'No post found with this id' });
              return;
          }
          res.json(BlogData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

router.post('/', withAuth, (req, res) => {
  Blog.create({
          title: req.body.title,
          content: req.body.content,
          user_id: req.session.user_id
      })
      .then(BlogData => res.json(BlogData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

router.put('/:id', withAuth, (req, res) => {
  Post.update({
          title: req.body.title,
          content: req.body.content
      }, {
          where: {
              id: req.params.id
          }
      }).then(BlogData => {
          if (!BlogData) {
              res.status(404).json({ message: 'No post found with this id' });
              return;
          }
          res.json(BlogData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

router.delete('/:id', withAuth, (req, res) => {
  Blog.destroy({
      where: {
        id: req.params.id
      }
    }).then(BlogData => {
      if (!BlogData) {
        res.status(404).json({ message: 'No blog found with this id!' });
        return;
    }
    res.json(BlogData);
  }).catch (err => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;
