// const User = require("../models/User");
// const Doctor = require("../models/Doctor");
// const asyncHandler = require("../utils/asyncHandler");

// // Helper to create a doctor for a user
// async function createDoctorForUser(userId, specialization) {
//     const doctor = new Doctor({
//         user: userId,
//         specialization,       // Use the passed specialization
//         availableSlots: []    // Start empty
//     });

//     await doctor.save();
//     return doctor;
// }

// // POST /api/auth/register
// const register = asyncHandler(async (req, res) => {
//     const { name, email, password, role, specialization } = req.body;

//     if (!name || !email || !password) {
//         return res.status(400).json({ message: "Missing required fields" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//         return res.status(400).json({ message: "Email already in use" });
//     }

//     // Create the user
//     const user = new User({ name, email, password, role });
//     await user.save();

//     // If role is doctor, ensure specialization is provided
//     if (role === "doctor") {
//         if (!specialization) {
//             return res.status(400).json({ message: "Specialization is required for doctors" });
//         }
//          await createDoctorForUser(user._id, specialization);
//     }

//     const token = user.generateJWT();
//     res.status(201).json({
//         token,
//         user: { id: user._id, name: user.name, email: user.email, role: user.role }
//     });
// });

// // POST /api/auth/login
// const login = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ message: "Missing email or password" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//         return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//         return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const token = user.generateJWT();
//     res.status(200).json({
//         token,
//         user: { id: user._id, name: user.name, email: user.email, role: user.role }
//     });
// });

// module.exports = { register, login };

const User = require("../models/User");
const Doctor = require("../models/Doctor");
const asyncHandler = require("../utils/asyncHandler");

// Helper to create a doctor for a user
async function createDoctorForUser(userId, specialization) {
    const doctor = new Doctor({
        user: userId,
        specialization,
        availableSlots: []
    });

    await doctor.save();
    return doctor;
}

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
    const { name, email, password, role, specialization } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    let doctorInfo = null;
    if (role === "doctor") {
        if (!specialization) {
            return res.status(400).json({ message: "Specialization is required for doctors" });
        }
        doctorInfo = await createDoctorForUser(user._id, specialization);
    }

    const token = user.generateJWT();
    res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        doctor: doctorInfo ? { id: doctorInfo._id, specialization: doctorInfo.specialization, availableSlots: doctorInfo.availableSlots } : null
    });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Missing email or password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // If doctor, fetch doctor info
    let doctorInfo = null;
    if (user.role === "doctor") {
        doctorInfo = await Doctor.findOne({ user: user._id }).select("specialization availableSlots");
    }

    const token = user.generateJWT();
    res.status(200).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        doctor: doctorInfo
    });
});

module.exports = { register, login };
