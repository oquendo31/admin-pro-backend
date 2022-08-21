
/* 
  Ruta: /api/usuarios
*/

const { Router } = require('express');
const { check } = require ('express-validator')
const { validarCampos }  = require('../middlewares/validar-campos')


const {getUsuarios,crearUsuario,actualizaUsuario,borrarUsuario} = require ('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();




//*********************  Consultar los usuarios  ********************
router.get( '/', validarJWT, getUsuarios );





//******************  Crear el usuario  ****************************
router.post( '/',
      [
          check('nombre','El nombre es obligatorio').not().isEmpty(),
          check('password','El password es obligatorio').not().isEmpty(),
          check('email','El email es obligatorio').isEmail(),
          validarCampos,
      ],
      crearUsuario  
  );


  //********************** Actualizar usuario   ***********************/

  router.put( '/:id',
  [       
          validarJWT,
          check('nombre','El nombre es obligatorio').not().isEmpty(),        
          check('email','El email es obligatorio').isEmail(),
          check('role','El role es obligatorio').not().isEmpty(),
          validarCampos,
         
  ],

  actualizaUsuario );  //debemos de defminir  el controlador en controllers





  //***************************   Borrar usuario  ********************************/

  router.delete( '/:id',  validarJWT,  borrarUsuario );








module.exports = router;