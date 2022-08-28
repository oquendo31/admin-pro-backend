
/* 
  Ruta: /api/busquedas/:busqueda
*/

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');

const { getTodo, getDocumentosColeccion } = require('../controllers/busquedas');

const router = Router();




//*********************  Consultar todo  ********************

// router.get( '/coleccion/:tabla/:busqueda', validarJWT, getDocumentosColeccion);
router.get('/coleccion/:tabla/:busqueda', validarJWT , getDocumentosColeccion );

router.get( '/:busqueda', validarJWT, getTodo);









module.exports = router;