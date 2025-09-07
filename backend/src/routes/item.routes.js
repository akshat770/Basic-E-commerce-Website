import express from "express";
import { getItems, createItem, updateItem, deleteItem } from "../controllers/item.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getItems);
router.post("/", verifyJWT, createItem);
router.put("/:id", verifyJWT, updateItem);
router.delete("/:id", verifyJWT, deleteItem);

export default router;
