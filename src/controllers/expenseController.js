import mongoose from "mongoose";
import ErrorHandler from "../middlewares/error/errorHandler.js";
import Expense from "../models/expenseModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import moment from "moment";
import "moment-timezone";

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
  // Getting the dates from the query
  const { startDate, endDate } = req.query;

  // Getting the branch from the query
  const { branch } = req.query;

  // If the user is not admin and trying to access without branches
  if (req.user.role !== "admin" && !branch) {
    return next(new ErrorHandler(403, "You don't have permission"));
  }

  // Convert the start and end dates to Bangladesh time
  const startOfDayBangladesh = startDate
    ? moment.tz(startDate, "Asia/Dhaka").startOf("day").toDate()
    : undefined;
  const endOfDayBangladesh = endDate
    ? moment.tz(endDate, "Asia/Dhaka").endOf("day").toDate()
    : undefined;

  /**
   * If date is available, then find with date. If not available,
   * then find without any filtering and find all expenses.
   */

  const matchQuery = {
    $and: [
      startOfDayBangladesh
        ? {
            createdAt: {
              $gte: startOfDayBangladesh,
              $lte: endOfDayBangladesh,
            },
          }
        : {},
      branch ? { branch: new mongoose.Types.ObjectId(branch) } : {},
    ],
  };

  const expenses = await Expense.aggregate([
    {
      $match: matchQuery,
    },
    {
      $lookup: {
        from: "branches", // Assuming the collection name for branches is "branches"
        localField: "branch",
        foreignField: "_id",
        as: "branchDetails",
      },
    },
    {
      $project: {
        _id: 1,
        type: 1,
        amount: 1,
        employeeName: 1,
        branch: { $arrayElemAt: ["$branchDetails.name", 0] }, // Assuming the branch name field is "name"
        createdAt: 1,
        updatedAt: 1,
        __v: 1,
      },
    },
    {
      $group: {
        _id: null,
        expenses: { $push: "$$ROOT" },
        totalExpense: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        expenses: 1,
        totalExpense: 1,
      },
    },
  ]);

  if (expenses.length === 0) {
    return res
      .status(200)
      .json({ success: true, expenses: [], totalExpense: 0 });
  }

  res.status(200).json({ ...expenses[0], success: true });
});
