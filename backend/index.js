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
connectDB(); // connect via your existing mongodb file
mongoose.set("strictQuery", false); // optional

// --- Middleware ---
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // --- Auth/logout ---
// app.get("/logout", (req, res) => {
//   req.logout(() => res.redirect("/"));
// });

app.get("/",(req,res)=>{
  app.send("server running")
})

// --- API Routes ---
app.use("/api/favorites", favoritesRoutes);
app.use("/api", require("./routes/auth"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/blogs", blogRoutes);


// --- Start Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
