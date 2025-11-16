const express=require("express");
const router=express.Router();
const {enqueue,getQueueForDoctor,updateQueueStatus,getQueuePositionForPatient}=require("../controllers/queueController")
const authMiddleware=require("../middleware/authMiddleware");

router.post("/enqueue",authMiddleware,enqueue);
router.get("/doctor",authMiddleware,getQueueForDoctor);
router.patch("/:queueItemId",authMiddleware,updateQueueStatus);
router.get("/patient/queue/:appointmentId",authMiddleware,getQueuePositionForPatient);
module.exports=router;