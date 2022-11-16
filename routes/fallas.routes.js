const express = require('express')
const router = express.Router();

const isAuth = require('../util/is_auth');
const fallascontroller = require('../controllers/fallas_controller');
router.get('/', isAuth, fallascontroller.get_root);
router.post('/new', isAuth, fallascontroller.post_new);
router.get('/:idfalla', isAuth, fallascontroller.get_delete);

module.exports = router;