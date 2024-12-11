const pool = require("../database");
const pagosCtrl = {};
const userCtrl = require("../controllers/user.controllers.js");

// Obtener todos los pagos 
pagosCtrl.getPagos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pagos");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener pagos:", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Función para generar una contraseña aleatoria
function generateRandomPassword(length) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Crear un nuevo pago
pagosCtrl.createPago = async (req, res) => {
  try {
    const { user_id, paquete_id, fecha_inicio, fecha_finalizacion } = req.body;

    if (!user_id || !paquete_id || !fecha_inicio || !fecha_finalizacion) {
      return res.status(400).json({
        error: "user_id, paquete_id, fecha_inicio y fecha_finalizacion son campos requeridos.",
      });
    }

    // Verificar si el usuario ya tiene un pago activo
    const activePayment = await pool.query(
      "SELECT * FROM pagos WHERE user_id = $1 AND fecha_finalizacion > NOW()",
      [user_id]
    );

    if (activePayment.rows.length > 0) {
      return res.status(400).json({
        error: "El usuario ya tiene un pago activo.",
      });
    }

    const result = await pool.query(
      "INSERT INTO pagos (user_id, paquete_id, fecha_inicio, fecha_finalizacion) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, paquete_id, fecha_inicio, fecha_finalizacion]
    );

    // Actualizar rol a 'Admin'
    const updateRoleResult = await userCtrl.updateUserRoleToAdmin(user_id);

    if (!updateRoleResult.success) {
      console.error("Error al actualizar rol del usuario:", updateRoleResult.error);
    }

    // Obtener la cantidad de colaboradores del paquete
    const paqueteResult = await pool.query(
      "SELECT numero_colaboradores FROM paquetes WHERE id = $1",
      [paquete_id]
    );
    const numeroColaboradores = paqueteResult.rows[0].numero_colaboradores;

    // Crear colaboradores
    for (let i = 1; i <= numeroColaboradores; i++) {
      const email = `${String(i).padStart(6, '0')}@colaborador.com`;
      const password = generateRandomPassword(8);
      await pool.query(
        "INSERT INTO colaboradores (email, password, usuario_id, pago_id) VALUES ($1, $2, $3, $4)",
        [email, password, user_id, result.rows[0].id]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear pago:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener un pago por su ID
pagosCtrl.getPago = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("ID del pago es requerido.");
    }

    const result = await pool.query(
      "SELECT * FROM pagos WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Pago no encontrado.");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener pago", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Obtener pagos por usuario
pagosCtrl.getPagosByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).send("ID del usuario es requerido.");
    }

    const result = await pool.query(
      "SELECT * FROM pagos WHERE user_id = $1",
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Pagos no encontrados.");
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener pagos por usuario", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Actualizar un pago por su ID
pagosCtrl.editPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { paquete_id, fecha_inicio, fecha_finalizacion } = req.body;

    if (!id) {
      return res.status(400).send("ID del pago es requerido.");
    }

    const updateFields = [];
    const values = [];

    if (paquete_id) {
      updateFields.push(`paquete_id = $${values.length + 1}`);
      values.push(paquete_id);
    }

    if (fecha_inicio) {
      updateFields.push(`fecha_inicio = $${values.length + 1}`);
      values.push(fecha_inicio);
    }

    if (fecha_finalizacion) {
      updateFields.push(`fecha_finalizacion = $${values.length + 1}`);
      values.push(fecha_finalizacion);
    }

    if (updateFields.length === 0) {
      return res.status(400).send("No hay campos para actualizar.");
    }

    const updateQuery = `UPDATE pagos SET ${updateFields.join(
      ", "
    )} WHERE id = $${values.length + 1} RETURNING *`;

    const result = await pool.query(updateQuery, [...values, id]);

    if (result.rows.length === 0) {
      return res.status(404).send("Pago no encontrado.");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al editar pago", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Eliminar un pago por su ID
pagosCtrl.deletePago = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("ID del pago es requerido.");
    }

    const result = await pool.query(
      "DELETE FROM pagos WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Pago no encontrado.");
    }

    res.json({
      message: "Pago eliminado correctamente.",
      deletedPago: result.rows[0],
    });
  } catch (error) {
    console.error("Error al eliminar pago", error);
    res.status(500).send("Error interno del servidor");
  }
};

module.exports = pagosCtrl;
