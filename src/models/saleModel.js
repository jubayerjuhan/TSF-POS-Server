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
    items: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          photo: {
            type: String,
            required: true,
          },
          id: {
            type: Number,
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
          costPrice: {
            type: Number,
            required: true,
          },
        },
      ],
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: "Please Select Product First",
      },
    },
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
    saleId: {
      type: Number,
      required: true,
    },

    partialAmountPayingDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
