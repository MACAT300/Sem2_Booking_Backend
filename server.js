// Load environment variables
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Setup an express app
const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Enable CORS (for frontend connection)
app.use(cors());

// Connect to MongoDB using Mongoose
async function connectToMongoDB() {
  try {
    //  Change database name to your hotel project
    await mongoose.connect(process.env.MONGODB_URL + "/hotel_booking");
    console.log(" MongoDB Connected Successfully");
  } catch (error) {
    console.error(" MongoDB Connection Failed:", error);
  }
}

// Trigger the connection
connectToMongoDB();

// Root route
app.get("/api/", (req, res) => {
  res.send(" Welcome to Hotel Booking API!");
});

// Import all the routers
app.use("/api/users", require("./routes/user"));
app.use("/api/rooms", require("./routes/room"));
app.use("/api/bookings", require("./routes/booking"));
app.use("/api/images", require("./routes/image"));
app.use("/api/reviews", require("./routes/reviews"));

app.use("/api/categories", require("./routes/category"));
app.use("/api/types", require("./routes/type"));

// Optional: serve static folder (e.g. for images)
app.use("/api/uploads", express.static("uploads"));

// Start the express server
app.listen(5555, () => {
  console.log("server is running at http://localhost:5555");
});
