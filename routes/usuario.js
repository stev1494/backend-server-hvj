var express = require('express');
var bcrypt = require('bcryptjs');
var jwt =  require('jsonwebtoken');
var mdAuth = require('../middlewares/auth');


var app = express();
var Usuario = require('../models/usuario');


app.get('/', (req, res, next) => {
    
    var desde = req.query.desde || 0;
    desde =  Number(desde);
    
    Usuario.find({}, 'nombre email img role')
           .skip(desde)
           .limit(5)
           .exec(
           (err, usuarios) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario',
                    errors: err
                });
            }
            // console.log(usuarios);
            Usuario.countDocuments({}, (err, conteo)=>{
                
                res.status(200).json({               
                    ok: true,
                    usuarios: usuarios,
                    total: conteo
                });

            })
            
        });
});


app.put('/:id', mdAuth.verficaToken , (req, res)=>{

    var id = req.params.id;
    var body = req.body;


    Usuario.findById(id, ( err, usuario )=>{
        
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if( !usuario ){
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con el' + id + 'no existe',
                    errors: {message: 'No existe un usuario con ese ID'}
                });
            }
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( (err, usuarioGuardado)=>{
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                });
            }

            res.status(200).json({
                ok:true,
                body: usuarioGuardado
            });
    
        });
    });
});


app.post('/', mdAuth.verficaToken ,(req, res)=>{

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password:  bcrypt.hashSync(body.password , 10),
        img: body.img,
        role: body.role
    });

    usuario.save( (err, usuarioGuardado )=>{
        if ( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok:true,
            body: usuarioGuardado,
            usuariotoken: req.usuario
        });

    });

});


app.delete('/:id' , mdAuth.verficaToken , (req, res)=>{

    var id =  req.params.id;

    Usuario.findByIdAndRemove( id , ( err , usuarioBorrado)=>{

        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el usuario',
                errors: err
            });
        }

        if ( !usuarioBorrado ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
            });
        }

        res.status(200).json({
            ok:true,
            body: usuarioBorrado
        });

    });

});


module.exports = app;