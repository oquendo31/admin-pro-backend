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

const actualizarMedico = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const medico = await Medico.findById(id);

        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg:'Médico no encontrado por Id'
            })            
        }

        const cambiosMedico = {
            usuario: uid,
            ...req.body
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id,cambiosMedico,{new: true});

        res.json ({
            ok: true,
            medico: medicoActualizado
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

   
}



//*************************************  Borrar el Médico   *******************************/

const borrarMedico = async(req, res = response) => {

    const id = req.params.id;


    try {

        const medico = await Medico.findById(id);

        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg:'Médico no encontrado por Id'
            })            
        }

        await Medico.findByIdAndDelete( id );
        res.json ({
            ok: true,
            medico: 'Médico borrado'
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}





module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}