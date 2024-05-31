module.exports = {
    paginaInicio: (req, res) => {
        let stmt = `SELECT id_empleado, identificacion, nombres, apellidos, correo, direccion, telefono, fotografia
                    FROM empleados`;
        bd.query(stmt, (err, result) => {
            res.render('partials/index.ejs', {
                titulo: "Bienvenido al sistema de nómina NGV",
                empleados: result,
            })
        })
    }
}