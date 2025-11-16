const Doctor = require("../models/Doctor");
const asyncHandler = require("../utils/asyncHandler");

// GET all doctors with user info
exports.listDoctors = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find().populate("user", "name email");

    if (doctors.length === 0) {
        return res.status(404).json({ message: "No doctors found" });
    }

    res.status(200).json(doctors);
});

// GET single doctor by ID with user info
exports.getDoctor = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id).populate("user", "name email");
    if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
});

// UPDATE doctor's availability
// exports.updateAvailability = asyncHandler(async (req, res) => {
//     const doctor = await Doctor.findOne({ user: req.user.id });

//     if (!doctor) {
//         return res.status(404).json({ message: "Doctor record not found" });
//     }

//     // When doctor.user is not populated, it is an ObjectId — not an object
//     const doctorUserId = doctor.user._id 
//         ? doctor.user._id.toString() 
//         : doctor.user.toString();

//     // Only admin or the doctor can update
//     if (!req.user.isAdmin && doctorUserId !== req.user._id.toString()) {
//         return res.status(403).json({ message: "Forbidden: cannot update availability" });
//     }

//     const { availableSlots } = req.body;
//     if (!Array.isArray(availableSlots)) {
//         return res.status(400).json({ message: "availableSlots must be an array" });
//     }

//     for (const slot of availableSlots) {
//         if (
//             !slot.date ||
//             isNaN(new Date(slot.date).getTime()) ||
//             !Array.isArray(slot.slots)
//         ) {
//             return res.status(400).json({
//                 message: "Each slot must have a valid date and an array of slots"
//             });
//         }
//     }

//     doctor.availableSlots = availableSlots;
//     await doctor.save();
//     await doctor.populate("user", "name email");

//     res.json(doctor);
// });

exports.updateAvailability = asyncHandler(async (req, res) => {
    // Use req.user.id from JWT (make sure your middleware sets this)
    const doctor = await Doctor.findOne({ user: req.user.id });

    if (!doctor) {
        return res.status(404).json({ message: "Doctor record not found" });
    }

    // doctor.user is an ObjectId, just convert it to string
    const doctorUserId = doctor.user.toString();

    // Only admin or the doctor can update
    if (!req.user.isAdmin && doctorUserId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden: cannot update availability" });
    }

    const { availableSlots } = req.body;
    if (!Array.isArray(availableSlots)) {
        return res.status(400).json({ message: "availableSlots must be an array" });
    }

    for (const slot of availableSlots) {
        if (
            !slot.date ||
            isNaN(new Date(slot.date).getTime()) ||
            !Array.isArray(slot.slots)
        ) {
            return res.status(400).json({
                message: "Each slot must have a valid date and an array of slots"
            });
        }
    }

    doctor.availableSlots = availableSlots;
    await doctor.save();

    // Populate user info for response
    await doctor.populate("user", "name email");

    res.json(doctor);
});
