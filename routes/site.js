let express = require('express');
let router = express.Router();
require('dotenv').config();

let authenticateUserCookie = require('./middlewares/authenticateUserCookie');
let siteController = require('../controllers/siteController');

router.get('/', siteController.index);
router.get('/home', authenticateUserCookie, siteController.home);


//USER
router.post('/login', siteController.login);
router.get('/logout', siteController.logout);


module.exports = router;