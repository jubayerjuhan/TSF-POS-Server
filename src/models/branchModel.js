import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    unique: [true, "There Is Another Branch With This Name"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },
  products: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    default: [],
  },
  moderators: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
});

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;
