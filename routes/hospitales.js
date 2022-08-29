/*
   ruta: '/api/hospitales'
*/


const { Router } = require('express');
const { check } = require ('express-validator')
const { validarCampos }  = require('../middlewares/validar-campos')

const { validarJWT } = require('../middlewares/validar-jwt');

const { 
        getHospitales,
        crearHospital,
        actualizarHospital,
        borrarHospital } = require('../controllers/hospitales')

const router = Router();




//*********************  Consultar los usuarios  ********************
router.get( '/', getHospitales );





//******************  Crear el usuario  ****************************
router.post( '/',
      [
        validarJWT,
        check('nombre','El nombre del hospital es necesario').not().isEmpty(),
        validarCampos
          
      ],
      crearHospital  
  );


  //********************** Actualizar usuario   ***********************/

  router.put( '/:id',
        [     
          validarJWT,
          check('nombre','El nombre del hospital es necesario').not().isEmpty(),
          validarCampos     
                
        ],
        actualizarHospital );  //debemos de defminir  el controlador en controllers





  //***************************   Borrar usuario  ********************************/

  router.delete( '/:id',
       validarJWT,
       borrarHospital
     );








module.exports = router;