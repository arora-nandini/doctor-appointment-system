const QueueItem = require("../models/QueueItem");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const asyncHandler = require("../utils/asyncHandler");

/* -----------------------------------------------------------
   GET QUEUE POSITION FOR PATIENT  (fixed version)
------------------------------------------------------------*/
exports.getQueuePositionForPatient = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;

    const queueItem = await QueueItem.findOne({ appointment: appointmentId })
        .populate({
            path: "appointment",
            select: "patient date time status",
            populate: {
                path: "patient",
                select: "name email"
            }
        })
        .populate({
            path: "doctor",
            select: "specialization user",
            populate: {
                path: "user",
                select: "name email"
            }
        });

    if (!queueItem) {
        return res.status(404).json({ message: "Queue entry not found for this appointment" });
    }

    // SAFETY CHECK → prevents crash
    if (!queueItem.appointment || !queueItem.appointment.patient) {
        return res.status(500).json({
            message: "Appointment record is missing patient field. Database or populate issue."
        });
    }

    // Ensure this appointment belongs to the logged-in patient
    if (queueItem.appointment.patient._id.toString() !== req.user.id) {
        return res.status(403).json({ message: "Forbidden: Not your appointment" });
    }

    res.json({
        position: queueItem.position,
        status: queueItem.status,
        appointment: queueItem.appointment,
        doctor: queueItem.doctor
    });
});


/* -----------------------------------------------------------
   ENQUEUE — When appointment is booked
------------------------------------------------------------*/
exports.enqueue = asyncHandler(async (req, res) => {
    const { appointmentId } = req.body;
    const io = req.app.get("io");

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
    }

    const doctorId = appointment.doctor;

    // Find last position for that doctor's queue
    const last = await QueueItem.find({ doctor: doctorId }).sort("-position").limit(1);
    const nextPos = last.length ? last[0].position + 1 : 1;

    const queueItem = await QueueItem.create({
        doctor: doctorId,
        appointment: appointmentId,
        position: nextPos
    });

    // Notify doctor dashboard about new queue
    io.to(`doctor_${doctorId}`).emit("queueUpdated", queueItem);

    res.status(201).json(queueItem);
});


/* -----------------------------------------------------------
   GET QUEUE FOR DOCTOR (full population)
------------------------------------------------------------*/
exports.getQueueForDoctor = asyncHandler(async (req, res) => {
    // Logged in doctor → find doctor record
    const doctor = await Doctor.findOne({ user: req.user.id });

    if (!doctor) {
        return res.status(404).json({ message: "Doctor record not found" });
    }

    const queue = await QueueItem.find({ doctor: doctor._id })
        .sort("position")
        .populate({
            path: "appointment",
            select: "patient date time status",
            populate: {
                path: "patient",
                select: "name email"
            }
        });

    res.json(queue);
});


/* -----------------------------------------------------------
   UPDATE QUEUE STATUS + EMIT SOCKET EVENT
------------------------------------------------------------*/
exports.updateQueueStatus = asyncHandler(async (req, res) => {
    const { queueItemId } = req.params;
    const { status } = req.body;
    const io = req.app.get("io");

    const validStatuses = ["waiting", "in-progress", "served", "skipped"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
    }

    const queueItem = await QueueItem.findById(queueItemId);
    if (!queueItem) {
        return res.status(404).json({ message: "Queue item not found" });
    }

    queueItem.status = status;
    await queueItem.save();

    io.to(`doctor_${queueItem.doctor}`).emit("queueUpdated", queueItem);

    res.json(queueItem);
});
