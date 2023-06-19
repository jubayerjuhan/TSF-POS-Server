import mongoose from "mongoose";

const customOrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: Number, required: true },
    description: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Order Taken", "Shipped", "Delivered"],
      default: "Order Taken",
    },
    advancePayment: { type: Number, default: 0, required: true },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const CustomOrder = mongoose.model("CustomOrder", customOrderSchema);

export default CustomOrder;
