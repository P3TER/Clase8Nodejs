module.exports = {
    paginaInicio: (req, res) => {
        let stmt = `SELECT id_empleado, identificacion, nombres, apellidos, correo, direccion, telefono, fotografia, estado
                    FROM empleados`;
        
        let stmtNomina = `SELECT fecha_nomina, id_empleado, salario_base, deduccion_salud, deduccion_pension, salario_neto, comisiones FROM nomina`

        bd.query(stmt, (err, result) => {
            if(err){
                return res.send(err);
            }
            bd.query(stmtNomina, (error, resultados) => {
                if(error){
                    return res.send(error);
                }
                res.render('partials/index.ejs', {
                    titulo: "Bienvenido al sistema de nómina NGV",
                    empleados: result,
                    nominas: resultados
                })
            })
        })
    }
}