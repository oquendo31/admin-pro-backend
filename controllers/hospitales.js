const {response} = require ('express');
const { body } = require('express-validator');

const Hospital = require('../models/hospital');




//******************** Consultar los hospitales ********************************
const getHospitales = async(req, res = response) => {

    const hospitales = await Hospital.find().populate('usuario','nombre ');
                                     

    res.json ({
        ok: true,
        hospitales
    })
}




//*****************************  Crear hospital ***********************************/
const crearHospital = async (req, res = response) => {

    
    const uid = req.uid;

    const hospital = new Hospital({
        usuario: uid,
         ...req.body
        });

    try {

       const hospitalDB = await hospital.save();
        res.json ({
            ok: true,
            hospital: hospitalDB 
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administardor'

        })
    }

   
}




//**************************   Actualizar el hospital  *********************************/

const actualizarHospital = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid; // Captura el usuario Id del token 

    try {

        const hospital = await Hospital.findById(id);

        if (!hospital) {
           return   res.status(404).json ({
            ok: false,
            msg:'Hospital no encontrado por id'
           });            
        }

       const cambiosHospital = {
        ...req.body,
        usuario: uid // coloca el usuario id del utlimo que hizo la modificación 
       }

       const hospitalActualizado = await Hospital.findByIdAndUpdate(id,cambiosHospital, {new: true})

        res.json ({
            ok: true,
            hospital: hospitalActualizado
        })
        
    } catch (error) {

        console.log(error)

        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
        
    }

   
}



//*************************************  Borrar el hospital   *******************************/

const borrarHospital = async (req, res = response) => {

    const id = req.params.id;  

    try {

        const hospital = await Hospital.findById(id);

        if (!hospital) {
           return   res.status(404).json ({
            ok: false,
            msg:'Hospital no encontrado por id'
           });            
        }

     await Hospital.findByIdAndDelete(id);


        res.json ({
            ok: true,
            msg: 'Hospital eliminado'
           
        })
        
    } catch (error) {

        console.log(error)

        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
        
    }

   
}





module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}