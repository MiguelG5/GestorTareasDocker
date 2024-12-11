const { Router } = require("express");
const router = Router();

const actividadesCtrl = require("../controllers/actividades.controllers.js");

router.get("/", actividadesCtrl.getActividades);

router.post("/", actividadesCtrl.createActividad);

router.get("/:id", actividadesCtrl.getActividadById);

router.get("/proyecto/:proyecto_id", actividadesCtrl.getActividadesByProyecto);

router.put("/:id", actividadesCtrl.editActividad);

router.delete("/:id", actividadesCtrl.deleteActividad);

module.exports = router;
