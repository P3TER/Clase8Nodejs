const fs = require('fs')

module.exports = {
    paginaAgregarEmpleado: (req, res) => {
        res.render('./partials/agregarEmpleado.ejs', {
            titulo: "Nómina NGV: Agregar empleado",
            message: ""
        })
    },

    agregarEmpleado: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No hubo archivos para cargar ...")
        }
        let message = "";
        let identificacion = req.body.identificacion;
        let nombres = req.body.nombres;
        let apellidos = req.body.apellidos;
        let correo = req.body.correo;
        let direccion = req.body.direccion;
        let telefono = req.body.telefono;
        let uploadedFile = req.files.fotografia;
        let fotografia = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];

        fotografia = nombres.split(' ')[0].toLowerCase() + apellidos.split(' ')[0].toLowerCase() + '.' + fileExtension;

        let empleadoStmt = `SELECT * FROM empleados WHERE identificacion = ${identificacion}`

        bd.query(empleadoStmt, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            if (result.length > 0) {
                mensaje = `El empleado con esta identificacion ya existe`
            } else {
                if (uploadedFile.mimetype === 'image/png' ||
                    uploadedFile.mimetype === 'image/jpeg' ||
                    uploadedFile.mimetype === 'image/gif') {

                    uploadedFile.mv(`public/assets/img/${fotografia}`, (err) => {
                        if (err) {
                            return res.status(500).send(err)
                        }
                        let stmt = `INSERT INTO empleados(identificacion, nombres, apellidos, correo, direccion, telefono, fotografia)
                                    VALUES ('${identificacion}', '${nombres}', '${apellidos}', '${correo}', '${direccion}', '${telefono}', '${fotografia}')`;

                        bd.query(stmt, (err, result) => {
                            if (err) {
                                return res.status(500).send(err)
                            }
                        })

                        res.redirect('/')
                    })
                } else {
                    mensaje = "Formato de imagen invalido:\nSolo se permiten imagenes '.jpeg', '.png', '.gif'"
                    res.redirect('/agregar')
                }
            }
        })
    },
    paginaEditarEmpleado: (req, res) => {
        let id_empleado = req.params.id_empleado
        let stmt = `SELECT * FROM empleados WHERE id_empleado = ${id_empleado}`;

        bd.query(stmt, (err, result) => {

            if (err) {
                return res.status(500).send(err)
            }

            res.render('editarEmpleado.ejs', {
                titulo: "Editar Empleado",
                empleado: result[0],
                message: ""
            })
        })
    },
    editarEmpleado: (req, res) => {
        console.log('Datos del formulario:', req.body); // Verificar si llegan datos

        let id_empleado = req.params.id_empleado;
        let identificacion = req.body.identificacion;
        let nombres = req.body.nombres;
        let apellidos = req.body.apellidos;
        let correo = req.body.correo;
        let direccion = req.body.direccion;
        let telefono = req.body.telefono;

        let stmt = `UPDATE empleados SET identificacion = '${identificacion}', nombres = '${nombres}', apellidos = '${apellidos}', correo = '${correo}', direccion = '${direccion}', telefono = '${telefono}'
                WHERE id_empleado = ${id_empleado}`;

        bd.query(stmt, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    eliminarEmpleado: (req, res) => {
        let id_empleado = req.params.id_empleado
        let stmtEliminar = `UPDATE empleados SET estado = false WHERE id_empleado = ${id_empleado}`

        bd.query(stmtEliminar, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.redirect('/')
        })

        //Estas sentencias se utilizarian en caso de que se estuviera cerrando
        //fisicamente el registro de la tabla "empleados"

        // let stmtImagen = `SELECT fotografia FROM empleados WHERE id_empleado = ${id_empleado}`

        // bd.query(stmtImagen, (err, result) => {
        //     if(err){
        //         return res.status(500).send(err)
        //     }

        //     let fotografia = result[0].fotografia

        //     fs.unlink(`public/assets/ing/${fotografia}`, (err) => {
        //         if (err) {
        //             return res.status(500).send(err)
        //         }
        //         bd.query(stmtEliminar, (err, result) => {
        //             if(err){
        //                 return res.status(500).send(err)
        //             }
        //             res.redirect('/')
        //         })
        //     })
        // })
    }
}