const {response} = require ('express');

const Medico = require('../models/medico');
const usuario = require('../models/usuario');




//******************** Consultar los medicos ********************************
const getMedicos = async(req, res = response) => {
    
    const medicos = await Medico.find()
                        .populate('usuario','nombre img')
                        .populate('hospital','nombre img');

    res.json ({
        ok: true,
        medicos
    })
}




//*****************************  Crear médico ***********************************/
const crearMedico = async (req, res = response) => {

    const uid = req.uid;

    const medico = new Medico({
        usuario: uid,
        ...req.body
    });


    try {
        const medicoDB = await medico.save();
        res.json ({
            ok: true,
            medico: medicoDB
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }

   
}




//**************************   Actualizar el hospital  *********************************/

const actualizarMedico = (req, res = response) => {

    res.json ({
        ok: true,
        msg: 'actualizarMedico'
    })
}



//*************************************  Borrar el hospital   *******************************/

const borrarMedico = (req, res = response) => {

    res.json ({
        ok: true,
        msg: 'borrarMedico'
    })
}





module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}