module.exports = {
  paginaAgregarNomina: (req, res) => {
    let message = "";
    let stmt = `SELECT * FROM empleados`;

    bd.query(stmt, (err, result) => {
      if (err) {
        return res.send(err);
      }
      res.render("partials/agregarNomina.ejs", {
        titulo: "Sistema de nómina NGV: Agregar Nómina",
        empleados: result,
        message: message,
      });
    });
  },
  agregarNomina: (req, res) => {
    let {
      id_empleado,
      salario_base,
      deduccion_salud,
      deduccion_pension,
      comisiones,
    } = req.body;

    let salud = parseFloat(salario_base) * parseFloat(deduccion_salud);
    let pension = parseFloat(salario_base) * parseFloat(deduccion_pension);
    let comision = parseFloat(salario_base) * parseFloat(comisiones);

    let salario_neto = (salario_base + comision - (salud + pension)).toFixed(2);

    let stmtConfirmacion = `SELECT * FROM nomina WHERE id_empleado = ${id_empleado}`;

    bd.query(stmtConfirmacion, (err, result) => {
      if (err) {
        return res.send(err);
      }
      if (result.length > 0) {
        message = "El empleado ya tiene una nómina registrada";
        res.render("partials/agregarNomina.ejs", {
          titulo: "Sistema de nómina NGV: Agregar Nómina",
          empleados: [],
          message: message,
        });
      } else {
        let stmtInsert = `INSERT INTO nomina (id_empleado, salario_base, deduccion_salud, deduccion_pension, salario_neto, comisiones)
                          VALUES (${id_empleado}, ${salario_base}, ${deduccion_salud}, ${deduccion_pension}, ${salario_neto.toFixed(0)}, ${comisiones})`;

        bd.query(stmtInsert, (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }
          res.redirect("/");
        });
      }
    });
  },
  paginaEditarNomina: (req, res) => {
    let id_nomina = req.params.id_nomina;
    let message = "";
    let stmtNomina = `SELECT * FROM nomina WHERE id_nomina = ${id_nomina}`;

    bd.query(stmtNomina, (err, result) => {
      if (err) {
        return res.send(err);
      }
      res.render("editarNomina.ejs", {
        titulo: "Editar Nómina",
        nomina: result[0],
        message: message,
      });
    });
  },
  editarNomina: (req, res) => {
    let id_nomina = req.params.id_nomina;
    let {
      fecha_nomina,
      id_empleado,
      salario_base,
      deduccion_salud,
      deduccion_pension,
      comisiones,
    } = req.body;

    let stmt = `UPDATE nomina SET fecha_nomina = '${fecha_nomina}', id_empleado = '${id_empleado}', salario_base = '${salario_base}', deduccion_salud = '${deduccion_salud}', deduccion_pension = '${deduccion_pension}', comisiones = '${comisiones}'
                WHERE id_nomina = ${id_nomina}`;

    bd.query(stmt, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect('/');
    });
  },
};
