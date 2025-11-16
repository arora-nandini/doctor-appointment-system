require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const  queueRoutes=require("./routes/queueRoutes");

const errorHandler = require("./middleware/errorHandler");

const startServer = async () => {
    try {
        // Connect to DB
        await connectDB(process.env.MONGO_URI);
        console.log("MongoDB connected");

        const app = express();
        app.use(cors());
        app.use(express.json());

        // Routes
        app.use("/api/auth", authRoutes);
        app.use("/api/doctors", doctorRoutes);
        app.use("/api/appointments", appointmentRoutes);
        app.use("/api/queue",queueRoutes);
        // Error handler

        
        app.use(errorHandler);

        // HTTP + Socket.IO
        const server = http.createServer(app);
        const io = new Server(server, {
            cors: { origin: "*", methods: ["GET", "POST"] },
        });

        // Socket.IO logic
        io.on("connection", (socket) => {
            console.log("User connected:", socket.id);

            socket.on("joinDoctorRoom", (doctorId) => {
                socket.join(`doctor_${doctorId}`);
                console.log(`User joined room for doctor ${doctorId}`);
            });

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });

        app.set("io", io);

        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1); // Exit if server setup fails
    }
};

// Start server
startServer();
