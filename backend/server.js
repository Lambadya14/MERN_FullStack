import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.route.js";
import cors from "cors";
import authenticateToken from "./middleware/authenticateToken.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); //allows us to accept JSON data in req.body
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.listen(5000, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});
