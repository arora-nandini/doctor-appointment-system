const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const QueueItem = require("../models/QueueItem");
const asyncHandler = require("../utils/asyncHandler");

// Book an appointment
exports.bookAppointment = asyncHandler(async (req, res) => {
    const { doctor, date, time } = req.body;
    const io = req.app.get("io");

    if (!doctor || !date || !time) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const appointment = await Appointment.create({
        patient: req.user.id,
        doctor,
        date,
        time
    });

    const lastQueueItem = await QueueItem.findOne({ doctor }).sort({ position: -1 });
const position = lastQueueItem ? lastQueueItem.position + 1 : 1;


    const queueItem = await QueueItem.create({
        doctor,
        appointment: appointment._id,
        position,
    });

    io.to(`doctor_${doctor}`).emit("queueUpdated", queueItem);

    res.status(201).json(appointment);
});

// Get appointments for logged-in user
exports.getAppointmentsForUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;
   const appointments = await Appointment.find({ patient: userId }).populate("doctor", "name specialization");

    res.json(appointments);
});

// Get appointments for logged-in doctor
exports.getAppointmentsForDoctor = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) return res.status(404).json({ message: 'Doctor record not found' });

    const appointments = await Appointment.find({ doctor: doctor._id }).populate("patient", "name email");
    res.json(appointments);
});

// Update appointment status
exports.updateStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const io = req.app.get("io");

    const validStatuses = ["booked", "completed", "cancelled", "no-show"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });

    appt.status = status;
    await appt.save();

    const queueItem = await QueueItem.findOne({ appointment: id });
    if (queueItem) {
        queueItem.status = status === "completed" ? "served" : status;
        await queueItem.save();
        io.to(`doctor_${queueItem.doctor}`).emit("queueUpdated", queueItem);
    }

    res.json(appt);
});
