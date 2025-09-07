import { User } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";

// ➤ Get user cart
export const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.itemId");
  res.json({ success: true, cart: user.cart });
});

// ➤ Add to cart
export const addToCart = asyncHandler(async (req, res) => {
  const { itemId, quantity } = req.body;

  if (!itemId || !quantity) throw new apiError(400, "Item ID and quantity required");

  const user = await User.findById(req.user._id);
  const existing = user.cart.find((c) => c.itemId.toString() === itemId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    user.cart.push({ itemId, quantity });
  }

  await user.save();
  res.json({ success: true, cart: user.cart });
});

// ➤ Remove from cart
export const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.body;

  if (!itemId) throw new apiError(400, "Item ID required");

  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter((c) => c.itemId.toString() !== itemId);

  await user.save();
  res.json({ success: true, cart: user.cart });
});
