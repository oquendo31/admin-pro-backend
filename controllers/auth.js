const { response } = require("express");
const bcrypt = require('bcryptjs')
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");


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


module.exports = {
    login
}