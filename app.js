const express = require('express')
const fileUpload = require('express-fileupload')
const mysql = require('mysql')
const path = require('path')
const bodyParser = require('body-parser')

const appServer = express()
const {paginaInicio} = require('./routes/index')

const {paginaAgregarEmpleado, agregarEmpleado, eliminarEmpleado, paginaEditarEmpleado, editarEmpleado} = require('./routes/empleado')

const PUERTO = process.env.PORT || 3000

const bd = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'empleadosbd'
})

bd.connect((err) => {
    if (err) {
        throw err
    }
    console.log('Conectado a la base de datos');
})

global.bd = bd;

appServer.set('port', PUERTO)
appServer.set('views', __dirname + "/views")
appServer.set('view engine', 'ejs')

// Middleware para analizar el cuerpo de las solicitudes POST
appServer.use(bodyParser.urlencoded({extended: true}))
appServer.use(bodyParser.json())

// Middleware para manejo de archivos
appServer.use(fileUpload())

appServer.use(express.static(path.join(__dirname, 'public')))

appServer.get('/', paginaInicio)
appServer.get('/agregar', paginaAgregarEmpleado)
appServer.post('/agregar_emp', agregarEmpleado)
appServer.get('/editar_emp/:id_empleado', paginaEditarEmpleado)
appServer.post('/editar_emp/:id_empleado', editarEmpleado)
appServer.get('/eliminar_emp/:id_empleado', eliminarEmpleado)

appServer.listen(PUERTO, () => {
    console.log(`http://localhost:${PUERTO}`);
})

// Manejador de errores
appServer.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal en el servidor');
});
