import express from "express";
import dotenv from "dotenv";
import cors from "cors";


import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import memberRoutes from "./routes/memberRoutes"
import salonRoutes from "./routes/salonRoutes"
import categoryRoutes from "./routes/categoryRoutes"
import productRoutes from "./routes/productRoutes"
import orderRoutes from "./routes/orderRoutes"


import connectDb from "./config/connectDB"
import morgan from "morgan";
connectDb()

dotenv.config();
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use("/api/members", memberRoutes)
app.use("/api/salones", salonRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/product", productRoutes)
app.use("/api/order", orderRoutes)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
});