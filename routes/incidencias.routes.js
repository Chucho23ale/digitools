const express = require('express')
const router = express.Router();
const eliminar = require("../util/eliminar");
const trabajo = require("../util/trabajo");

const incicontroller = require('../controllers/inci_controller');
const isAuth = require('../util/is_auth');
router.get('/', isAuth, incicontroller.get_root);
router.post('/img', isAuth, incicontroller.post_img);
router.post('/buscar', incicontroller.get_buscar);
router.post('/asignar', incicontroller.post_asignar);
router.post('/reasignar', incicontroller.post_reasignar);
router.post('/get_unidades', incicontroller.post_getunidades);
router.get('/cerrar/:id', incicontroller.get_cerrar);
router.get('/abrir/:id', incicontroller.get_abrir);
router.post('/new', isAuth, incicontroller.post_new);
router.post('/edit/:id', isAuth, incicontroller.post_edit);
router.get('/:idticket/:idtrabajo', isAuth, eliminar, incicontroller.get_delete);
router.get('/:id', isAuth, incicontroller.get_one);
router.post('/:id', isAuth, trabajo, incicontroller.post_trabajo);

module.exports = router;