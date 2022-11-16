const express = require('express');
const path = require('path');
const router = express.Router();
const boton_admin =require('../util/boton_administrar');

const isAuth = require('../util/is_auth');
const control_controller = require('../controllers/control_controller');
router.get('/', isAuth, boton_admin, control_controller.get_root);
router.get('/porcentajesecobra', isAuth, boton_admin, control_controller.get_porcentajesecobra);
router.get('/fallascomunes', isAuth, boton_admin, control_controller.get_fallascomunes);

module.exports = router;