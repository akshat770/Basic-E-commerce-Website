import { Item } from "../models/item.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";

// ➤ Get all items (with filters)
export const getItems = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice } = req.query;

  let query = {};
  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const items = await Item.find(query);
  res.json({ success: true, items });
});

// ➤ Create item
export const createItem = asyncHandler(async (req, res) => {
  const { name, price, category } = req.body;

  if (!name || !price || !category) {
    throw new apiError(400, "All fields are required");
  }

  const item = await Item.create({ name, price, category });
  res.status(201).json({ success: true, item });
});

// ➤ Update item
export const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!item) throw new apiError(404, "Item not found");

  res.json({ success: true, item });
});

// ➤ Delete item
export const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);

  if (!item) throw new apiError(404, "Item not found");

  res.json({ success: true, message: "Item deleted" });
});
