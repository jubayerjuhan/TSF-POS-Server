import Sale from "../models/saleModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";

// error handler function
import ErrorHandler from "../middlewares/error/errorHandler.js";
import mongoose from "mongoose";

// controller function to add a sale
export const makeSale = catchAsyncError(async (req, res, next) => {
  const sale = await Sale.create(req.body);

  // checking if total payment is less than partial payment amount
  if (req.body.total < req.body.partialPaymentAmount)
    return next(
      new ErrorHandler(400, "Partial payment is more than total amount")
    );

  res.status(200).json({
    success: true,
    sale: sale,
    message: "Sale Successfully Made",
  });
});

// controller function for deleting a sale
export const deleteSale = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const sale = await Sale.findByIdAndDelete(id);

  // throwing error if no sale with the id available
  if (!sale) return next(new ErrorHandler(400, "Sale Id Required"));

  res.status(200).json({
    success: true,
    message: "Sale Deleted",
  });
});

// controller function to get one sale document from database
export const getSale = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const sale = await Sale.findById(id);

  // throwing error if no sale with the id available
  if (!sale)
    return next(new ErrorHandler(404, "No sale found with this sale id"));

  res.status(200).json({
    success: true,
    sale,
  });
});

// controller function to get sales from one date to another
export const getSales = catchAsyncError(async (req, res, next) => {
  // getting the dates from body
  const { date, branch } = req.body;

  // defining an empty array
  let allSales = [];

  /**
   * if date is available then find with date, if not available
   * then find without anything
   */
  const saleInfo = await Sale.aggregate([
    {
      $match: {
        $and: [
          branch ? { branch: new mongoose.Types.ObjectId(branch) } : {},
          date
            ? {
                createdAt: {
                  $gte: new Date(date?.startDate),
                  $lte: new Date(date?.endDate),
                },
              }
            : {},
        ],
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: {
            $cond: {
              if: "$partialPayment",
              then: "$partialPaymentAmount",
              else: "$total",
            },
          },
        },
        creditCard: {
          $sum: {
            $cond: [
              { $eq: ["$paymentMethod", "Credit Card"] },
              {
                $cond: [
                  { $eq: ["$partialPayment", true] },
                  "$partialPaymentAmount",
                  "$total",
                ],
              },
              0,
            ],
          },
        },
        cash: {
          $sum: {
            $cond: [
              { $eq: ["$paymentMethod", "Cash"] },
              {
                $cond: [
                  { $eq: ["$partialPayment", true] },
                  "$partialPaymentAmount",
                  "$total",
                ],
              },
              0,
            ],
          },
        },
        bKash: {
          $sum: {
            $cond: [
              { $eq: ["$paymentMethod", "bKash"] },
              {
                $cond: [
                  { $eq: ["$partialPayment", true] },
                  "$partialPaymentAmount",
                  "$total",
                ],
              },
              0,
            ],
          },
        },
        count: { $sum: 1 },
        sales: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        count: 1,
        paymentMethods: [
          { name: "Credit Card", total: "$creditCard" },
          { name: "Cash", total: "$cash" },
          { name: "bKash", total: "$bKash" },
        ],
        sales: 1,
      },
    },
  ]);

  // sending response to the server
  res.status(200).json({
    success: true,
    saleInfo:
      saleInfo.length !== 0
        ? saleInfo
        : {
            total: 0,
            count: 0,
            sales: [],
            paymentMethods: [
              {
                name: "Credit Card",
                total: 0,
              },
              {
                name: "Cash",
                total: 0,
              },
              {
                name: "bKash",
                total: 0,
              },
            ],
          },
  });
});
