import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required."],
    },
    productId: {
      type: Number,
      unique: true,
      required: [true, "Product Id is required."],
    },
    description: {
      type: String,
      required: [true, "Product description is required."],
    },
    photo: {
      type: String,
      required: [true, "Product photo is required."],
    },
    wood: {
      type: String,
      required: [true, "Product wood is required."],
    },
    color: {
      type: String,
      required: [true, "Product color is required."],
    },
    costPrice: {
      type: Number,
      required: [true, "Product cost price is required."],
    },
    sellPrice: {
      type: Number,
      required: [true, "Product sell price is required."],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
