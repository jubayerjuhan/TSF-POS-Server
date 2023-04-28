import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: [true, "Total Is Required"],
    },
    discount: {
      type: Number,
      default: 0,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["Cash", "Credit Card", "bKash"],
      required: true,
    },
    partialPayment: {
      type: Boolean,
      required: [true, "Partial Payment Status Is Required"],
    },
    partialPaymentAmount: {
      type: Number,
      required: [
        function () {
          return this.partialPayment;
        },
        "Partial Payment Amount Required",
      ],
    },
    tax: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: [true, "Branch Is Required"],
    },
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
