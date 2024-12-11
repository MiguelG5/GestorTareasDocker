const pool = require("../database");

const actividadesCtrl = {};

// Obtener todas las actividades
actividadesCtrl.getActividades = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM actividades");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener actividades:", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Crear una nueva actividad
actividadesCtrl.createActividad = async (req, res) => {
  try {
    const { proyecto_id, nombre_actividad, descripcion, fecha_finalizacion } = req.body;

    if (!nombre_actividad) {
      return res.status(400).json({
        error: "proyecto_id y nombre_actividad son campos requeridos.",
      });
    }

    const result = await pool.query(
      "INSERT INTO actividades (proyecto_id, nombre_actividad, descripcion, fecha_creacion, fecha_finalizacion) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4) RETURNING *",
      [proyecto_id, nombre_actividad, descripcion, fecha_finalizacion]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear actividad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener una actividad por su ID
actividadesCtrl.getActividadById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("ID de la actividad es requerido.");
    }

    const result = await pool.query(
      "SELECT * FROM actividades WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Actividad no encontrada.");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener actividad", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Obtener actividades por proyecto
// Obtener actividades por proyecto
actividadesCtrl.getActividadesByProyecto = async (req, res) => {
  try {
    const { proyecto_id } = req.params;

    if (!proyecto_id) {
      return res.status(400).send("ID del proyecto es requerido.");
    }

    const result = await pool.query(
      "SELECT * FROM actividades WHERE proyecto_id = $1",
      [proyecto_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Actividades no encontradas.");
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener actividades por proyecto", error);
    res.status(500).send("Error interno del servidor");
  }
};


// Actualizar una actividad por su ID
actividadesCtrl.editActividad = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_actividad, descripcion, fecha_finalizacion } = req.body;

    if (!id) {
      return res.status(400).send("ID de la actividad es requerido.");
    }

    const updateFields = [];
    const values = [];

    if (nombre_actividad) {
      updateFields.push(`nombre_actividad = $${values.length + 1}`);
      values.push(nombre_actividad);
    }

    if (descripcion) {
      updateFields.push(`descripcion = $${values.length + 1}`);
      values.push(descripcion);
    }

    if (fecha_finalizacion) {
      updateFields.push(`fecha_finalizacion = $${values.length + 1}`);
      values.push(fecha_finalizacion);
    }

    const updateQuery = `UPDATE actividades SET ${updateFields.join(
      ", "
    )} WHERE id = $${values.length + 1} RETURNING *`;

    const result = await pool.query(updateQuery, [...values, id]);

    if (result.rows.length === 0) {
      return res.status(404).send("Actividad no encontrada.");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al editar actividad", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Eliminar una actividad por su ID
actividadesCtrl.deleteActividad = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("ID de la actividad es requerido.");
    }

    const result = await pool.query(
      "DELETE FROM actividades WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Actividad no encontrada.");
    }

    res.json({
      message: "Actividad eliminada correctamente.",
      deletedActividad: result.rows[0],
    });
  } catch (error) {
    console.error("Error al eliminar actividad", error);
    res.status(500).send("Error interno del servidor");
  }
};

module.exports = actividadesCtrl;
