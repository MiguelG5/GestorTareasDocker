const { Router } = require("express");
const router = Router();
const userCtrl = require("../../src/controllers/user.controllers");

//POST
router.post("/register", userCtrl.createUser);
router.post("/login", userCtrl.loginUser);
router.post("/sendCode", userCtrl.resetPassword);
router.post("/validCode", userCtrl.validCode);
router.put("/updatePassword", userCtrl.updatePassword);
router.post("/secondFactor", userCtrl.secondFactor);
router.post("/validarcorreo", userCtrl.validarcorreo);
router.get("/users", userCtrl.getAllUsers);

// PUT
router.put("/updateUser", userCtrl.updateUser);

// DELETE
router.delete("/deleteUser/:id", userCtrl.deleteUser);
module.exports = router;
