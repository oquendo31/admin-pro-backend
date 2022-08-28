

const fs = require('fs')

const Usuario = require('../models/usuario')
const Medico = require('../models/medico')
const Hospital = require('../models/hospital')


const borrarImagen = (path) => {

    if ( fs.existsSync( path ) ) { // Si existe una imagen vieja la borro
        fs.unlinkSync( path ); // Funcionalidad de borrar imagen anterior 

     }
}


const actualizarImagen = async (tipo, id, nombreArchivo) => {

   let pathViejo = '';
    switch ( tipo ) {

            case 'medicos':
                    const medico = await Medico.findById(id);
                    if (!medico) {
                    console.log('No es un médico por id')
                    return false;
                    }
                    // Verificar si tiene una imagen asignada
                     pathViejo = `./uploads/medicos/${ medico.img }`                     
                    borrarImagen(pathViejo);                            

                    medico.img = nombreArchivo;
                    await medico.save(); // Guardar imagen en la bd 
                    return true;  

            break;           


            case 'usuarios':

                const usuario = await Usuario.findById(id);
                if (!usuario) {
                console.log('No es un usuario por id')
                return false;
                }
                // Verificar si tiene una imagen asignada
                 pathViejo = `./uploads/hospitales/${ usuario.img }`                     
                borrarImagen(pathViejo);                            

                usuario.img = nombreArchivo;
                await usuario.save(); // Guardar imagen en la bd 
                return true;
                

            break;



            case 'hospitales':
                const hospital = await Hospital.findById(id);
                if (!hospital) {
                console.log('No es un hospital por id')
                return false;
                }
                // Verificar si tiene una imagen asignada
                 pathViejo = `./uploads/hospitales/${ hospital.img }`                     
                borrarImagen(pathViejo);                            

                hospital.img = nombreArchivo;
                await hospital.save(); // Guardar imagen en la bd 
                return true; 
            break;



            default:
            break;
    }

}













module.exports = {
    actualizarImagen
}