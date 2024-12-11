const { Router } = require("express");
const router = Router();

const pagosCtrl = require("../controllers/pagos.controllers.js");

router.get("/", pagosCtrl.getPagos);

router.post("/", pagosCtrl.createPago);

router.get("/:id", pagosCtrl.getPago);

router.get("/user/:user_id", pagosCtrl.getPagosByUser);

router.put("/:id", pagosCtrl.editPago);

router.delete("/:id", pagosCtrl.deletePago);

module.exports = router;
