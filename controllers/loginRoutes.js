const router = require('express').Router();
const { User } = require('../models');

router.get('/', (req, res) => {
    return res.render('login');
});

router.post('/login', async (req, res) => {
    console.log("log in attempt")
    try {
        const userData = await User.findOne({ where: { email: req.body.email } });
    
        if (!userData) {
          res
            .status(400)
            .json({ message: 'Incorrect email or password, please try again' });
          return;
        }
    
        const validPassword = await userData.checkPassword(req.body.password);
    
        if (!validPassword) {
          res
            .status(400)
            .json({ message: 'Incorrect email or password, please try again' });
          return;
        }
    
        req.session.save(() => {
          req.session.userID = userData.id;
          req.session.loggedIn = true;
          
          res.json({ user: userData, message: 'You are now logged in!' });
        });
    
      } catch (err) {
        res.status(400).json(err);
      }
});

router.post('/logout', async (req, res) => {
    console.log("log out attempt")
    if (req.session.loggedIn) {
        req.session.destroy(() => {
          res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

router.post('/new', async (req, res) => {
    console.log("signup attempt")
    try {
        const dbUserData = await User.create({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        req.session.save(() => {
          req.session.loggedIn = true;
          req.session.userID = dbUserData.get({ plain: true }).id;
          res.json({ user: dbUserData, message: 'You have now signed up!' });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;