const pool = require("../database");

const paquetesCtrl = {};

// Obtener todos los paquetes
paquetesCtrl.getPaquetes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM paquetes");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener paquetes:", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Crear un nuevo paquete
paquetesCtrl.createPaquete = async (req, res) => {
  try {
    const { nombre_paquete, descripcion, costo, duracion, numero_colaboradores } = req.body;

    if (!nombre_paquete || !costo || !duracion || numero_colaboradores === undefined) {
      return res.status(400).json({
        error: "nombre_paquete, costo, duracion y numero_colaboradores son campos requeridos.",
      });
    }

    const result = await pool.query(
      "INSERT INTO paquetes (nombre_paquete, descripcion, costo, duracion, numero_colaboradores) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nombre_paquete, descripcion, costo, duracion, numero_colaboradores]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear paquete:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener un paquete por su ID
paquetesCtrl.getPaquete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("ID del paquete es requerido.");
    }

    const result = await pool.query(
      "SELECT * FROM paquetes WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Paquete no encontrado.");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener paquete", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Actualizar un paquete por su ID
paquetesCtrl.editPaquete = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_paquete, descripcion, costo, duracion, numero_colaboradores } = req.body;

    if (!id) {
      return res.status(400).send("ID del paquete es requerido.");
    }

    const updateFields = [];
    const values = [];

    if (nombre_paquete) {
      updateFields.push(`nombre_paquete = $${values.length + 1}`);
      values.push(nombre_paquete);
    }

    if (descripcion) {
      updateFields.push(`descripcion = $${values.length + 1}`);
      values.push(descripcion);
    }

    if (costo) {
      updateFields.push(`costo = $${values.length + 1}`);
      values.push(costo);
    }

    if (duracion) {
      updateFields.push(`duracion = $${values.length + 1}`);
      values.push(duracion);
    }

    if (numero_colaboradores !== undefined) {
      updateFields.push(`numero_colaboradores = $${values.length + 1}`);
      values.push(numero_colaboradores);
    }

    const updateQuery = `UPDATE paquetes SET ${updateFields.join(
      ", "
    )} WHERE id = $${values.length + 1} RETURNING *`;

    const result = await pool.query(updateQuery, [...values, id]);

    if (result.rows.length === 0) {
      return res.status(404).send("Paquete no encontrado.");
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al editar paquete", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Eliminar un paquete por su ID
paquetesCtrl.deletePaquete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send("ID del paquete es requerido.");
    }

    const result = await pool.query(
      "DELETE FROM paquetes WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Paquete no encontrado.");
    }

    res.json({
      message: "Paquete eliminado correctamente.",
      deletedPaquete: result.rows[0],
    });
  } catch (error) {
    console.error("Error al eliminar paquete", error);
    res.status(500).send("Error interno del servidor");
  }
};

module.exports = paquetesCtrl;
