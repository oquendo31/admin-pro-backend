/*
   ruta: '/api/medicos'
*/

const { Router } = require('express');
const { check } = require ('express-validator')
const { validarCampos }  = require('../middlewares/validar-campos')

const { validarJWT } = require('../middlewares/validar-jwt');

const { 
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico } = require('../controllers/medicos')

const router = Router();




//*********************  Consultar los usuarios  ********************
router.get( '/', getMedicos );





//******************  Crear el usuario  ****************************
router.post( '/',
      [
        validarJWT,
        check('nombre','El nombre del medico es necesario').not().isEmpty(),
        check('hospital','El hospital id debe de sewr válido').not().isMongoId(),
        validarCampos
          
      ],
      crearMedico  
  );


  //********************** Actualizar usuario   ***********************/

  router.put( '/:id',
        [     
                
                
        ],
        actualizarMedico );  //debemos de defminir  el controlador en controllers





  //***************************   Borrar usuario  ********************************/

  router.delete( '/:id',  borrarMedico );








module.exports = router;