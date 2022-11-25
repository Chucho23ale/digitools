const express = require('express');
const router = express.Router();
const isAuth = require('../util/is_auth');
const facturacioncontroller = require('../controllers/facturacion.controller');

router.get('/', isAuth, facturacioncontroller.get_root);
router.get('/pagar/:cliente/:yyyy/:mes', isAuth, facturacioncontroller.get_pagar);
router.get('/meses/:y', isAuth, facturacioncontroller.get_meses);
router.get('/fac/:yyyy/:mes', isAuth, facturacioncontroller.get_facturas);

module.exports = router;