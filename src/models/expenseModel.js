import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["salary", "food", "other"],
    required: [true, "Expense Type Is Required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount Is Required"],
  },
  employeeName: {
    type: String,
    required: [
      function () {
        return this.type === "salary";
      },
      "Employee Name Is Required",
    ],
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: [true, "Branch Is Required"],
  },
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
