const path = require ('path');
const fs = require ('fs');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");



const  fileUpload = (req, res = response ) => {


  const tipo = req.params.tipo;
  const id = req.params.id;

  //Validar tipo
  const tiposValidos = ['hospitales','medicos','usuarios'];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
        ok: false,
        msg: 'No es un médico, usuario u hospital'
    })
  }

// Validamos que exista un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
        ok: false,
        msg: 'No hay ningún archivo'
    });
  }


  // Procesar la imagen...
 
  const file = req.files.imagen;
 
  //Sacamos la extencion de l archivo

  const nombreCortado = file.name.split('.'); //goku.1.jpg
  const extencionArchivo = nombreCortado[ nombreCortado.length - 1 ]

  // Validar la extención 
  const extencionesValidas = ['png','jpg','jpeg','gif']

  if (!extencionesValidas.includes( extencionArchivo ) ) {
    return res.status(400).json({
        ok: false,
        msg: 'No es una extención permitida'
    });    
  }



  // Generar el nombre del archivo     instalamos 'npm i uuid'
  const nombreArchivo = `${ uuidv4() }.${extencionArchivo }`;


  // path para guardar la imagen
  const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover la imagen
    file.mv(path, (err) => {

        if (err) {
            console.log(err)
            return res.status(500).json({
                ok: false,
                msg:'Error al mover la imagen'
            })
        } 
        
        // Actualizar la base de datos

        actualizarImagen( tipo, id, nombreArchivo );
            
    res.json({
        ok: true,
        msg: 'Archivo subido',
        nombreArchivo
    })
 });

}




//------------------------------------------ Controlador para mostrar una imagen--------------------------------------------------

const retornaImagen = (req, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname,  `../uploads/${ tipo }/${ foto }`);

    // Imagen por defecto

    if (fs.existsSync(pathImg)) {
      res.sendFile( pathImg );      
    } else{
      const pathImg = path.join( __dirname,  `../uploads/no-img.png`);
      res.sendFile( pathImg );       
    }

    

}





module.exports = {
    fileUpload,
    retornaImagen
}