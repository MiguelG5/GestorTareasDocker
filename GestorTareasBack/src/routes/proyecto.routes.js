const { Router } = require("express");
const router = Router();

const proyectoCtrl = require("../controllers/proyecto.controllers.js");

router.get("/", proyectoCtrl.getProyectos);

router.post("/", proyectoCtrl.createProyecto);

router.get("/:id", proyectoCtrl.getProyecto);

router.get("/user/:user_id", proyectoCtrl.getProyectosByUser); // Cambiada la ruta para evitar conflictos

router.put("/:id", proyectoCtrl.editProyecto);

router.delete("/:id", proyectoCtrl.deleteProyecto);

module.exports = router;
