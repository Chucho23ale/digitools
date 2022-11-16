const express = require('express')
const router = express.Router();

const userscontroller = require('../controllers/users_controller');
router.get('/login', userscontroller.get_login);
router.post('/login', userscontroller.post_login);
router.get('/logout', userscontroller.get_logout);

module.exports = router;