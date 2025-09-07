import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String
});

export const Item = mongoose.model("Item", ItemSchema);
