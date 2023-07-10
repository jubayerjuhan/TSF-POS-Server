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
      required: [false, "Partial Payment Status Is Required"],
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
    },

    partialAmountPayingDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Define pre-save middleware
saleSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Generate and assign saleId only if the document is new
    const lastSale = await Sale.findOne(
      {},
      {},
      { sort: { saleId: -1 } }
    ).exec();
    const newSaleId = lastSale ? lastSale.saleId + 1 : 1;
    this.saleId = newSaleId;
  }
  next();
});

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
