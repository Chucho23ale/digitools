const express = require('express');
const router = express.Router();
const isAuth = require('../util/is_auth');
const empleadoscontroller = require('../controllers/empleados_controller');

router.get('/', isAuth, empleadoscontroller.get_root);
router.post('/new', isAuth, empleadoscontroller.post_new);
router.get('/:usuario', isAuth, empleadoscontroller.get_delete);

module.exports = router;