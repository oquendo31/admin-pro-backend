
const {response} = require ('express')
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');





//******************************   CONSULTAR USUARIOS  *************************************
const getUsuarios = async(req, res) => {

    const usuarios = await Usuario.find( {}, 'nombre email role google');

    res.json({
        ok: true,    
        usuarios,
        uid: req.uid
    });
}






//***************************  CREAR USUARIO  ***********************************************/

const crearUsuario = async(req, res = response) => {
   const {email, password} = req.body;

    try {

        const existeEmail = await Usuario.findOne({email});

      if ( existeEmail ) {
        return res.status(400).json ({
            ok: false,
            msg: 'El correo ya está registrado'
        })
      }
            const usuario = new Usuario( req.body );
         
         //Encriptar contraseña
         const salt = bcrypt.genSaltSync();
         usuario.password = bcrypt.hashSync( password, salt );

          //Guardar usuario
            await usuario.save();    
            
             //Generamos el TOKEN - JWT
             const token =  await generarJWT(usuario.id);

        
            res.json({
                ok: true,    
                usuario,
                token
         });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })        
    }   
}



//***********************************   ACTUALIZAR USUARIO  *************************************************

const actualizaUsuario = async (req, res = response) => {
     // TODO:  Validar token y comprobar si es el usuario correcto

    const  uid = req.params.id;

    try {

        const usuarioDB =   await Usuario.findById(uid);

        if ( !usuarioDB ) {
            return res.status(404).json ({
                ok: false,
                msg:'No existe un usuario por ese id'
            });
        } 

        // Actualizaciones 

        const { password, google, email,  ...campos } = req.body; // Estraigo los campos requeridos 

        if ( usuarioDB.email !== email ) 
         {
            const existeEmail = await Usuario.findOne({ email })
            if (existeEmail) {
                return res.status(400).json({
                    ok:false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }

        }

        campos.email = email;  
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true });
       
        res.json ({
            ok: true,
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })        
    }
}




//********************************************  BORRAR USUARIOS  *******************************************/

const borrarUsuario = async (req, res = response) => {

    const  uid = req.params.id;

    try {

        const usuarioDB =   await Usuario.findById(uid);

        if ( !usuarioDB ) {
            return res.status(404).json ({
                ok: false,
                msg:'No existe un usuario por ese id'
            });
        } 
        await Usuario.findByIdAndDelete( uid );

        res.json ({
            ok:true,
            msg: 'EUsuario eliminado'           
        });
        
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

        
    }

   

    

}





module.exports  = {
    getUsuarios,
    crearUsuario,
    actualizaUsuario,
    borrarUsuario
}