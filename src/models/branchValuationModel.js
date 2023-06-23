import mongoose from "mongoose";

const branchValuationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const BranchValuation = mongoose.model(
  "BranchValuation",
  branchValuationSchema
);

export default BranchValuation;
