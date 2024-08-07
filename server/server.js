const express = require("express"); // Import Express
const app = express(); // Initialize Express
const multer = require("multer");
const session = require("express-session"); //Import Express-Session library
const cors = require("cors");
const passport = require("./config/passportConfig.js"); //Import the main Passport library
const pool = require("./databases/database.js");

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow only this origin to send requests with credentials
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(session({
    secret: "Some secrets are meant to stay secrets forever",
    resave: false,
    saveUninitialized:true,
    cookie: { secure: false } // Set to true if using HTTPS
})); // Basic express session({..}) initialization.
app.use(passport.initialize()); // Init passport on every route call.
app.use(passport.session()); // allow passport to use "express-session".
app.use(express.urlencoded({ extended: false }));
app.use("/image", express.static("image"));

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);
const recipesRoutes = require("./routes/recipesRoutes");
app.use("/recipes", recipesRoutes);

// Unknown route handler
app.use((req, res) => {
    return res.status(404).json({
        message: "Route not found",
    });
})

const comPort = 4000;
app.listen(comPort, () => console.log('Server on localhost: '+ comPort))

