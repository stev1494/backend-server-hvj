//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors')

//Importando rutas
var appRoutes = require('./routes/app');
var usuarioRoutes =  require('./routes/usuario');
var loginRoutes =  require('./routes/login');
var hospitalRoutes =  require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');



//Inicializando variables
var app = express();

//CORS
app.use(cors({ origin: "http://localhost:4200" }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-COntrol-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
}) 



//Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Conexion db
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
    },
    (err,res)=>{
    if(err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')

});

//Rutas
app.use('/usuario',usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img',imagenesRoutes);

app.use('/',appRoutes);


//Escuchando peticiones
app.listen( 3000, ()=>{
    console.log('Servidor en puerto 3000: \x1b[32m%s\x1b[0m', 'online')
})