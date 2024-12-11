const pool = require("../database");

const actividadColaboradorCtrl = {};

// Obtener todos los enrolamientos
actividadColaboradorCtrl.getEnrolamientos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM actividad_colaborador");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener enrolamientos:", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Obtener enrolamientos por ID de actividad
actividadColaboradorCtrl.getEnrolamientosByActividad = async (req, res) => {
  try {
    const { actividad_id } = req.params;

    if (!actividad_id) {
      return res.status(400).send("ID de la actividad es requerido.");
    }

    const result = await pool.query(
      "SELECT * FROM actividad_colaborador WHERE actividad_id = $1",
      [actividad_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Enrolamientos no encontrados para esta actividad.");
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener enrolamientos por actividad", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Obtener enrolamientos por ID de colaborador
actividadColaboradorCtrl.getEnrolamientosByColaborador = async (req, res) => {
  try {
    const { colaborador_id } = req.params;

    if (!colaborador_id) {
      return res.status(400).send("ID del colaborador es requerido.");
    }

    const result = await pool.query(
      "SELECT * FROM actividad_colaborador WHERE colaborador_id = $1",
      [colaborador_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Enrolamientos no encontrados para este colaborador.");
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener enrolamientos por colaborador", error);
    res.status(500).send("Error interno del servidor");
  }
};

actividadColaboradorCtrl.eliminarColaboradorDeActividad = async (req, res) => {
  try {
    const { actividad_id, colaborador_id } = req.params;

    if (!actividad_id || !colaborador_id) {
      return res.status(400).send("actividad_id y colaborador_id son campos requeridos.");
    }

    const result = await pool.query(
      "DELETE FROM actividad_colaborador WHERE actividad_id = $1 AND colaborador_id = $2 RETURNING *",
      [actividad_id, colaborador_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("No se encontró el colaborador enrolado en la actividad.");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al eliminar colaborador de actividad:", error);
    res.status(500).send("Error interno del servidor");
  }
};
// Enrolar múltiples colaboradores en una actividad
// actividad_colaborador.controllers.js

// Enrolar múltiples colaboradores en una actividad
actividadColaboradorCtrl.enrolarColaboradoresEnActividad = async (req, res) => {
  try {
    const { actividad_id } = req.body;
    const colaboradores = req.body.colaboradores || [];

    if (!actividad_id || colaboradores.length === 0) {
      return res.status(400).json({
        error: "actividad_id y colaboradores (arreglo de IDs) son campos requeridos y no pueden estar vacíos.",
      });
    }

    // Verificar si la actividad existe
    const actividadCheck = await pool.query(
      "SELECT * FROM actividades WHERE id = $1",
      [actividad_id]
    );

    if (actividadCheck.rows.length === 0) {
      return res.status(404).send("Actividad no encontrada.");
    }

    // Usar una transacción para garantizar atomicidad
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const promises = colaboradores.map(async (colaborador_id) => {
        // Verificar si el colaborador existe
        const colaboradorCheck = await client.query(
          "SELECT * FROM colaboradores WHERE id = $1",
          [colaborador_id]
        );

        if (colaboradorCheck.rows.length === 0) {
          console.warn(`Colaborador con ID ${colaborador_id} no encontrado, no se realizará el enrolamiento.`);
          return null;
        }

        // Enrolar el colaborador a la actividad
        const result = await client.query(
          "INSERT INTO actividad_colaborador (actividad_id, colaborador_id, fecha_asignacion) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING *",
          [actividad_id, colaborador_id]
        );

        return result.rows[0];
      });

      // Ejecutar todas las promesas y esperar a que terminen
      const enrolamientos = await Promise.all(promises);

      await client.query("COMMIT");
      res.json(enrolamientos.filter(enrolamiento => enrolamiento !== null)); // Retornar los enrolamientos exitosos
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error al enrolar colaboradores en actividad:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error general al enrolar colaboradores en actividad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


module.exports = actividadColaboradorCtrl;
