// backend/server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./db'); // --- ADD THIS LINE ---

// --- CONNECT TO DATABASE ---
connectDB(); // --- ADD THIS LINE ---

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// --- DELETE THE OLD MONGOOSE CONNECTION CODE THAT WAS HERE ---

// API Routes
app.use('/contacts', require('./routes/contacts'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});