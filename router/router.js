const router = require("express").Router();
const usercontro = require("../contro/userContro");

router.post("/save", usercontro.add);
router.get("/fetch", usercontro.getAll);
router.get("/fetchby/:id", usercontro.findById);
router.put("/modify/:id", usercontro.updateAll);
router.delete("/remove/:id", usercontro.deleteDetails);

module.exports = router;
