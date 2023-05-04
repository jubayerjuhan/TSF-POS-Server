import mongoose from "mongoose";
import ErrorHandler from "../middlewares/error/errorHandler.js";
import Expense from "../models/expenseModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import moment from "moment";

// controller function to add expense
export const addExpense = catchAsyncError(async (req, res, next) => {
  // getting branch from req query
  const { branch } = req.query;

  // creating the expense document in database
  await Expense.create({ ...req.body, branch });

  res.status(200).json({
    success: true,
    message: "Expense added",
  });
});

// controller function for deleting a expense
export const deleteExpense = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const expense = await Expense.findByIdAndDelete(id);

  // throwing error if no expense with the id available
  if (!expense) return next(new ErrorHandler(400, "Expense not available"));

  res.status(200).json({
    success: true,
    message: "Expense Deleted",
  });
});

// controller function to get one expense document from database
export const getExpense = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const expense = await Expense.findById(id).populate("branch", "name");

  // throwing error if no expense with the id available
  if (!expense)
    return next(new ErrorHandler(404, "No expense found with this expense id"));

  res.status(200).json({
    success: true,
    expense,
  });
});

/**
 * controller function to get expenses
 * admins can see both all branches expenses and the single branches expenses
 * and the moderators can only see the expenses from a single branch
 */

export const getExpenses = catchAsyncError(async (req, res, next) => {
  // getting the dates from body
  const { date } = req.body;

  // getting the branch from quary
  const { branch } = req.query;

  // if the user is not admin and trying to access without branches
  if (req.user.role !== "admin" && !branch)
    return next(new ErrorHandler(403, "You don't have permission"));

  /**
   * if date is available then find with date, if not available
   * then find without any filtering and find all
   */

  const expenses = await Expense.aggregate([
    {
      $match: {
        $and: [
          !date
            ? {}
            : {
                createdAt: {
                  $gte: moment(date?.startDate).startOf("day").toDate(),
                  $lte: moment(date?.endDate).endOf("day").toDate(),
                },
              },

          branch ? { branch: new mongoose.Types.ObjectId(branch) } : {},
        ],
      },
    },
  ]);
  res.status(200).json({
    success: true,
    expenses,
  });
});
