const express = require("express");
const http = require("http");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = require("./db/mongodb");

const favoritesRoutes = require("./routes/favorites");
const blogRoutes = require("./routes/blogRoutes");

dotenv.config();
const app = express();
const server = http.createServer(app);

// --- MongoDB ---
connectDB();
mongoose.set("strictQuery", false);

// --- Allowed Origins ---
const allowedOrigins = [
  "http://localhost:5173",
  "https://luniostore-frontend.vercel.app",
];

// --- CORS Middleware ---
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// --- Body Parsers ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Static Files ---
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API Routes ---
app.use("/api/favorites", favoritesRoutes);
app.use("/api", require("./routes/auth"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/blogs", blogRoutes);

// --- Start Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
