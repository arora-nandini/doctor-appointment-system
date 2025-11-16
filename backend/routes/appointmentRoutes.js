const express=require("express");
const router=express.Router();
const appointmentController=require("../controllers/appointmentController");

const authMiddleware=require("../middleware/authMiddleware");

router.post("/",authMiddleware,appointmentController.bookAppointment);
router.get("/user",authMiddleware,appointmentController.getAppointmentsForUser);
router.get("/doctor",authMiddleware,appointmentController.getAppointmentsForDoctor);
router.patch("/:id/status",authMiddleware,appointmentController.updateStatus)

module.exports=router