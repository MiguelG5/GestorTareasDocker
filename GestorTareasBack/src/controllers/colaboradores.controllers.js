const pool = require("../database");

const colaboradoresCtrl = {};

// Obtener todos los colaboradores
colaboradoresCtrl.getColaboradores = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM colaboradores");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener colaboradores:", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Obtener colaboradores por ID de usuario
colaboradoresCtrl.getColaboradoresByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).send("ID del usuario es requerido.");
    }

    const result = await pool.query(
      "SELECT * FROM colaboradores WHERE usuario_id = $1",
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Colaboradores no encontrados para este usuario.");
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener colaboradores por usuario", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Enrolar un colaborador en un proyecto
colaboradoresCtrl.enrolarColaborador = async (req, res) => {
  try {
    const { colaborador_id, proyecto_id } = req.body;

    if (!colaborador_id || !proyecto_id) {
      return res.status(400).json({
        error: "colaborador_id y proyecto_id son campos requeridos.",
      });
    }

    // Verificar si el colaborador y el proyecto existen
    const colaboradorCheck = await pool.query(
      "SELECT * FROM colaboradores WHERE id = $1",
      [colaborador_id]
    );

    const proyectoCheck = await pool.query(
      "SELECT * FROM proyecto WHERE id = $1",
      [proyecto_id]
    );

    if (colaboradorCheck.rows.length === 0) {
      return res.status(404).send("Colaborador no encontrado.");
    }

    if (proyectoCheck.rows.length === 0) {
      return res.status(404).send("Proyecto no encontrado.");
    }

    // Enrolar el colaborador al proyecto
    const result = await pool.query(
      "UPDATE colaboradores SET proyecto_id = $1 WHERE id = $2 RETURNING *",
      [proyecto_id, colaborador_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al enrolar colaborador en proyecto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener colaboradores por lista de IDs
colaboradoresCtrl.getColaboradoresByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        error: "Se requiere un arreglo no vacío de IDs de colaboradores.",
      });
    }

    // Consultar colaboradores por IDs
    const result = await pool.query(
      `SELECT * FROM colaboradores WHERE id IN (${ids.join(",")})`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener colaboradores por IDs:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar correo y contraseña de un colaborador
colaboradoresCtrl.updateColaborador = async (req, res) => {
  try {
    const { id, email, password } = req.body;

    if (!id || !email) {
      return res.status(400).json({
        error: "ID, email y password son campos requeridos.",
      });
    }

    // Actualizar el colaborador
    const result = await pool.query(
      "UPDATE colaboradores SET email = $1, password = $2 WHERE id = $3 RETURNING *",
      [email, password, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Colaborador no encontrado.");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar colaborador:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = colaboradoresCtrl;
