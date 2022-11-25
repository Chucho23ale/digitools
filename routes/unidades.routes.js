const express = require('express')
const router = express.Router();
const boton_admin =require('../util/boton_administrar');

const isAuth = require('../util/is_auth');
const unidadescontroller = require('../controllers/unidades_controller');
router.get('/', isAuth, boton_admin, unidadescontroller.get_root);
router.post('/new', isAuth, boton_admin, unidadescontroller.post_new);
router.get('/:imei', isAuth, boton_admin, unidadescontroller.get_delete);
router.get('/edit/:imei', isAuth, boton_admin, unidadescontroller.get_edit);
router.post('/edit/:imei', isAuth, boton_admin, unidadescontroller.post_edit);

module.exports = router;