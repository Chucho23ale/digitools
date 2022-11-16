const express = require('express');
const path = require('path');
const router = express.Router();
const boton_admin =require('../util/boton_administrar');

const isAuth = require('../util/is_auth');
const clientes_controller = require('../controllers/clientes_controller');
router.get('/', isAuth, boton_admin, clientes_controller.get_root);
router.post('/new', isAuth, boton_admin, clientes_controller.post_new);
router.get('/:usuario', isAuth, boton_admin, clientes_controller.get_delete);

module.exports = router;