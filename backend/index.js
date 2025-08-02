const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
 
const blogRoutes = require("./routes/blogRoutes");


const connectDB = require("./db/mongodb");

dotenv.config();
const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));







app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

app.use("/api", require("./routes/auth"));
app.use("/api/products",require("./routes/productRoutes"));
app.use("/api/orders",require("./routes/orderRoutes"));
app.use("/api/reviews",require("./routes/reviewRoutes"));
app.use("/api/blogs", blogRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
