import express from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cart.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, getCart);
router.post("/add", verifyJWT, addToCart);
router.post("/remove", verifyJWT, removeFromCart);

export default router;
