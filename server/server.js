const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./databases/database.js");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// Unknown route handler
app.use((req, res) => {
    return res.status(404).json({
        message: "Route not found",
    });
})

const comPort = 4000;
app.listen(comPort, () => console.log('Server on localhost: '+ comPort))

