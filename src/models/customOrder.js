import mongoose from "mongoose";

const customOrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    description: { type: String, required: true },
    color: { type: String, required: true },
    wood: { type: String, required: true },
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

    advancePaymentAt: {
      type: Date,
      default: function () {
        return new Date().toISOString();
      },
      required: true,
    },

    deliveredAt: {
      type: Date,
      required: function () {
        return this.status === "Delivered";
      },
    },
    orderId: {
      type: Number,
    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

// Define pre-save middleware
customOrderSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Generate and assign orderId only if the document is new
    const lastOrder = await CustomOrder.findOne(
      {},
      {},
      { sort: { orderId: -1 } }
    ).exec();
    const newOrderId = lastOrder ? lastOrder.orderId + 1 : 1;
    this.orderId = newOrderId;
  }
  next();
});

const CustomOrder = mongoose.model("CustomOrder", customOrderSchema);

export default CustomOrder;
