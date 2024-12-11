const { Router } = require("express");
const router = Router();

const paquetesCtrl = require("../controllers/paquetes.controllers.js");

router.get("/", paquetesCtrl.getPaquetes);

router.post("/", paquetesCtrl.createPaquete);

router.get("/:id", paquetesCtrl.getPaquete);

router.put("/:id", paquetesCtrl.editPaquete);

router.delete("/:id", paquetesCtrl.deletePaquete);

module.exports = router;
