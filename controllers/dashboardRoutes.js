const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  console.log(req.session);
  const rawPostData = await Post.findAll({
    where: {
      user_id: req.session.userID,
    },
    include: [{ model: User }],
    attributes: {
      include: [
        [
          sequelize.literal(
            '(SELECT name FROM user WHERE user.id = post.user_id)'
          ),
          'username',
        ],
      ],
    },
  });
  let postData = [];
  for (i = 0; i < rawPostData.length; i++) {
    postData.push(rawPostData[i].get({ plain: true }));
    postData[i].date = new Date(postData[i].date).toLocaleDateString();
  }
  console.log(postData);
  return res.render('dashboard', {
    postData,
    loggedIn: req.session.loggedIn,
    userID: req.session.userID
  });
});

router.get('/new', withAuth, async (req, res) => {
  return res.render('add-post', {
    loggedIn: req.session.loggedIn,
    userID: req.session.userID
  });
});

router.get('/post/:id', withAuth, async (req, res) => {
  console.log("look at post menu");
  console.log(req.params.id);
  let postData = await Post.findByPk(req.params.id, {
    include: [{ model: User }],
    attributes: {
      include: [
        [
          sequelize.literal(
            '(SELECT name FROM user WHERE user.id = post.user_id)'
          ),
          'username',
        ],
      ],
    },
  });
  postData = postData.get({plain: true});
  postData.date = new Date(postData.date).toLocaleDateString();
  return res.render('post-menu', {
    postData,
    loggedIn: req.session.loggedIn
  });
});
// only update route. update and submit found below. 
router.get('/post/:id/update', withAuth, async (req, res) => {
  return res.render('update-post', {
    loggedIn: req.session.loggedIn,
    userID: req.session.userID,
    postID: req.params.id
  });
});
//  Add route
router.post('/new/add', async (req, res) => {
  console.log("post add attempt")
    try {
        const dbUserData = await Post.create({
            title: req.body.postTitle,
            contents: req.body.postContent,
            user_id: req.session.userID,
            date: Date.now()
        });
        res.status(200).json("ok");
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
// Update and submit Route
router.put('/post/:id/update/submit', async (req, res) => {
  console.log("post update attempt")
    try {
      const dbUserData = await Post.update({
        title: req.body.postTitle,
        contents: req.body.postContent,
        user_id: req.session.userID,
        date: Date.now()
      },
      {
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
// Delete Route
router.delete('/post/:id/delete', async (req, res) => {
  console.log("post delete attempt")
  console.log(req.params);
    try {
        console.log(req.params.id);
        const commentData = await Comment.destroy({
            where: {
              post_id: Number(req.params.id)
            }
        });
        const dbUserData = await Post.destroy({
            where: {
              id: Number(req.params.id)
            }
        });
        res.status(204).json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;