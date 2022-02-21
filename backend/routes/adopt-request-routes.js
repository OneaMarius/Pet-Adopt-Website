const express = require('express');
const adoptRequestController = require("../controllers/adoptrequest-controller");
const router = express.Router();

router.get('/',adoptRequestController.GetAllAdoptRequests);
router.post("/new", adoptRequestController.CreateAdoptRequest);
router.patch("/update", adoptRequestController.UpdateStatusAdoptRequest);
router.delete("/delete", adoptRequestController.DeleteAdoptRequest);


module.exports = router;



