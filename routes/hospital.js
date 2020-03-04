var express = require('express');
var mdAuth = require('../middlewares/auth');


var app = express();
var Hospital = require('../models/hospital');


app.get('/', (req, res, next) => {

    var desde =  req.query.desde || 0;
    desde = Number(desde);
    
    Hospital.find({})
           .skip(desde)
           .populate('usuario', 'nombre email')
           .exec(
           (err, hospitales) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospital',
                    errors: err
                });
            }
            //  console.log(hospitales);

            Hospital.count({}, (err, conteo)=>{
                res.status(200).json({               
                    ok: true,
                    hospitales: hospitales,
                    total: conteo
                });

            })
           
        });
});


app.put('/:id', mdAuth.verficaToken , (req, res)=>{

    var id = req.params.id;
    var body = req.body;


    Hospital.findById(id, ( err, hospital )=>{
        
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if( !hospital ){
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el' + id + 'no existe',
                    errors: {message: 'No existe un hospital con ese ID'}
                });
            }
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save( (err, hospitalGuardado)=>{
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok:true,
                hospital: hospitalGuardado
            });
    
        });
    });
});


app.post('/', mdAuth.verficaToken ,(req, res)=>{

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save( (err, hospitalGuardado )=>{
        if ( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok:true,
            hospital: hospitalGuardado,
        });

    });

});


app.delete('/:id' , mdAuth.verficaToken , (req, res)=>{

    var id =  req.params.id;

    Hospital.findOneAndDelete( id , ( err , hospitalBorrado)=>{

        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el hospital',
                errors: err
            });
        }

        if ( !hospitalBorrado ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
            });
        }

        res.status(200).json({
            ok:true,
            hospital: hospitalBorrado
        });

    });

});


module.exports = app;