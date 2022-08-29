const { response } = require("express");
const bcrypt = require('bcryptjs')
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const { googleverify } = require("../helpers/google-verify");


const login = async(req, resp = response) => {

    const {email, password} = req.body;



    try {

        // Verificar email

        const usuarioDB = await Usuario.findOne({email});

        if (!usuarioDB) {
            return resp.status(404).json({
                ok:false,
                msg: 'email no encontrado'
            })
        }

       // Verificar contraseña
        
       const validPassword = bcrypt.compareSync(password, usuarioDB.password)  //compara la contraseña con la de la base de datos

       if (!validPassword) {
        return resp.status(400).json({
            ok: false,
            msg: 'Contraseña no válida'
        })
       }



       //Generamos el TOKEN - JWT

       const token =  await generarJWT(usuarioDB.id);

   


        resp.json({
            ok: true,
            token
        })
        
    } catch (error) {

        console.log(error);
        resp.status(500).json({
            ok: false,
            msg:'Hable con el administrador'
        })
        
    }


}

const googleSignIn = async(req, resp = response) => {

    try {
        const {email, name, picture} =  await googleverify( req.body.token );

        const usuarioBD = await Usuario.findOne({ email }) // bUsca si el usuario existe en la BD
        let usuario;

        if (!usuarioBD) {  // Si no existe lo creo
             usuario = new Usuario({
                nombre: name,
                email: email,
                password: '@@@',
                img: picture,
                google: true

             })
        } else {
            usuario = usuarioBD;
            usuario.google = true;
        }

        // GUardar usuario
        await usuario.save();

         //Generamos el TOKEN - JWT
         const token =  await generarJWT(usuario.id);


             resp.json({
             ok: true,
             email, name, picture,
             token
        });
        
    } catch (error) {        
        console.log( error );
        resp.status(400).json({
            ok: false,
            msg: 'Token de google no es correcto'
        })
  
    }    


}

const renewToken = async(req, res = response ) => {
    const uid = req.uid;
    //Generamos el TOKEN - JWT
    const token =  await generarJWT(uid);


    res.json({
        ok: true,
        token
    })

}


module.exports = {
    login,
    googleSignIn,
    renewToken
}