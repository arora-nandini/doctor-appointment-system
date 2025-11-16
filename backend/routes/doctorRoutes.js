const express=require("express");
const router=express.Router();
const authMiddleware =require("../middleware/authMiddleware")
const doctorController=require("../controllers/doctorController")

router.get("/",doctorController.listDoctors);
router.get("/:id",doctorController.getDoctor);
router.put("/availability",authMiddleware,doctorController.updateAvailability);

module.exports=router;