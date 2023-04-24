const express = require('express');
const homeRoutes = require('./homeRoutes');
const loginRoutes = require('./loginRoutes');
const dashboardRoutes = require('./dashboardRoutes');
var exphbs = require('express-handlebars');

const router = express();
router.engine('handlebars', exphbs({defaultLayout: 'main'}));
router.set('view engine', 'handlebars');

router.use('/dashboard', dashboardRoutes);
router.use('/login', loginRoutes);
router.use('/', homeRoutes);

module.exports = router;
