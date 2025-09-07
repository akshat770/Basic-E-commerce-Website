import dotenv from "dotenv"
import app from './app.js'
import { connectDB } from "./db/index.js";

dotenv.config({
    path: './.env'
})


connectDB()
.then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
})
.catch((error) => {
    console.error("Database connection failed", error);
});


