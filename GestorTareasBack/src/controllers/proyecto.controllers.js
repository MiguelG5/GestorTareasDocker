const pool = require("../database");

const proyectoCtrl = {};

// Obtener todos los proyectos
proyectoCtrl.getProyectos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM proyecto");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Crear un nuevo proyecto
proyectoCtrl.createProyecto = async (req, res) => {
  try {
    const { user_id, nombre_del_proyecto, descripcion, fecha_finalizacion } = req.body;

    if (!user_id || !nombre_del_proyecto) {
      return res.status(400).json({
        error: "user_id y nombre_del_proyecto son campos requeridos.",
      });
    }

    const result = await pool.query(
      "INSERT INTO proyecto (user_id, nombre_del_proyecto, descripcion, fecha_creacion, fecha_finalizacion) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4) RETURNING *",
      [user_id, nombre_del_proyecto, descripcion, fecha_finalizacion]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener un proyecto por su ID
proyectoCtrl.getProyecto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("ID del proyecto es requerido.");
    }

    const result = await pool.query(
      "SELECT * FROM proyecto WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Proyecto no encontrado.");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener proyecto", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Obtener proyectos por el ID del usuario
proyectoCtrl.getProyectosByUser = async (req, res) => {
  try {
    const { user_id } = req.params; // Cambiado de req.query a req.params

    if (!user_id) {
      return res.status(400).send("ID del usuario es requerido.");
    }

    const result = await pool.query(
      "SELECT * FROM proyecto WHERE user_id = $1",
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Proyectos no encontrados.");
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener proyectos por usuario", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Actualizar un proyecto por su ID
proyectoCtrl.editProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_del_proyecto, descripcion, fecha_finalizacion } = req.body;

    if (!id) {
      return res.status(400).send("ID del proyecto es requerido.");
    }

    const updateFields = [];
    const values = [];

    if (nombre_del_proyecto) {
      updateFields.push(`nombre_del_proyecto = $${values.length + 1}`);
      values.push(nombre_del_proyecto);
    }

    if (descripcion) {
      updateFields.push(`descripcion = $${values.length + 1}`);
      values.push(descripcion);
    }

    if (fecha_finalizacion) {
      updateFields.push(`fecha_finalizacion = $${values.length + 1}`);
      values.push(fecha_finalizacion);
    }

    const updateQuery = `UPDATE proyecto SET ${updateFields.join(
      ", "
    )} WHERE id = $${values.length + 1} RETURNING *`;

    const result = await pool.query(updateQuery, [...values, id]);

    if (result.rows.length === 0) {
      return res.status(404).send("Proyecto no encontrado.");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al editar proyecto", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Eliminar un proyecto por su ID
proyectoCtrl.deleteProyecto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("ID del proyecto es requerido.");
    }

    const result = await pool.query(
      "DELETE FROM proyecto WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Proyecto no encontrado.");
    }

    res.json({
      message: "Proyecto eliminado correctamente.",
      deletedProyecto: result.rows[0],
    });
  } catch (error) {
    console.error("Error al eliminar proyecto", error);
    res.status(500).send("Error interno del servidor");
  }
};

module.exports = proyectoCtrl;
