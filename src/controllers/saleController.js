import Sale from "../models/saleModel.js";
import catchAsyncError from "../utils/catchAsyncError.js";

// error handler function
import ErrorHandler from "../middlewares/error/errorHandler.js";
import mongoose from "mongoose";
import moment from "moment";
import Branch from "../models/branchModel.js";
import "moment-timezone";

// controller function to add a sale
export const makeSale = catchAsyncError(async (req, res, next) => {
  // checking if total payment is less than partial payment amount
  if (req.body.total < req.body.partialPaymentAmount)
    return next(
      new ErrorHandler(400, "Partial payment is more than total amount")
    );
  const sale = await Sale.create({ ...req.body });

  if (sale) {
    const branch = await Branch.findById(req.body.branch);

    for (const item of req.body.items) {
      // Find the product in the branch's products array
      const product = branch.products.find((prod) =>
        new mongoose.Types.ObjectId(prod.id).equals(
          new mongoose.Types.ObjectId(item._id)
        )
      );

      if (product) {
        // Reduce the quantity of the product in the branch
        if (product.quantity < item.quantity) {
          // deleting the sale
          await Sale.findByIdAndDelete(sale._id);

          // sending error with message
          return next(
            new ErrorHandler(
              400,
              "Product Quantity Is Greater Than Available Stock"
            )
          );
        }

        // reducing the quantity of product
        product.quantity -= item.quantity;
      }
    }
    // Save the updated branch with reduced quantities
    await branch.save();
  }

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

  const sale = await Sale.findById(id).populate("branch");
  // throwing error if no sale with the id available
  if (!sale)
    return next(new ErrorHandler(404, "No sale found with this sale id"));

  res.status(200).json({
    success: true,
    sale,
  });
});

// controller function to get one sale document from database
export const completeSaleWithFullAmount = catchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;

    const sale = await Sale.findByIdAndUpdate(
      id,
      {
        partialAmountPayingDate: Date.now(),
      },
      { new: true }
    );

    // throwing error if no sale with the id available
    if (!sale)
      return next(new ErrorHandler(404, "No sale found with this sale id"));

    res.status(200).json({
      success: true,
      sale,
      message: "Sale Marked as Complete",
    });
  }
);

// controller function to get sales from one date to another
export const getSales = catchAsyncError(async (req, res, next) => {
  // getting the dates from body
  const { startDate, endDate, branch } = req.query;

  // defining an empty array
  let allSales = [];

  if (req.user.role !== "admin" && !branch)
    return next(new ErrorHandler(403, "You don't have permission"));

  /**
   * if date is available then find with date, if not available
   * then find without anything
   */

  // Convert the start and end dates to Bangladesh time
  const startOfDayBangladesh = startDate
    ? moment.tz(startDate, "Asia/Dhaka").startOf("day").toDate()
    : undefined;
  const endOfDayBangladesh = endDate
    ? moment.tz(endDate, "Asia/Dhaka").endOf("day").toDate()
    : undefined;

  const saleInfo = await Sale.aggregate([
    {
      $match: {
        $and: [
          branch ? { branch: new mongoose.Types.ObjectId(branch) } : {},
          startDate && endDate
            ? {
                createdAt: {
                  $gte: startOfDayBangladesh,
                  $lte: endOfDayBangladesh,
                },
              }
            : {},
        ],
      },
    },
    {
      $lookup: {
        from: "branches", // Replace with the actual name of the Branch collection
        localField: "branch",
        foreignField: "_id",
        as: "branch",
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
        branch: { $arrayElemAt: ["$branch", 0] },
      },
    },
  ]);

  // sending response to the server
  res.status(200).json({
    success: true,
    saleInfo:
      saleInfo.length !== 0
        ? saleInfo[0]
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

export const getPartialPayments = catchAsyncError(async (req, res, next) => {
  const { startDate, endDate, branch } = req.query;

  const completedPartialPayments = await Sale.find({
    partialAmountPayingDate: {
      $gte: moment(startDate).startOf("day").toDate(),
      $lte: moment(endDate).endOf("day").toDate(),
    },
    branch: branch ? branch : { $exists: true },
  });

  const incompletedPartialPayment = await Sale.find({
    createdAt: {
      $gte: moment(startDate).startOf("day").toDate(),
      $lte: moment(endDate).endOf("day").toDate(),
    },
    branch: branch ? branch : { $exists: true },
    partialAmountPayingDate: { $exists: false },
    partialPayment: true,
  });

  const completeModifiedSales = completedPartialPayments.map((sale) => {
    const secondPartialPaymentAmount = sale.total - sale.partialPaymentAmount;
    return { ...sale._doc, secondPartialPaymentAmount };
  });

  const incompleteModifiedSales = incompletedPartialPayment.map((sale) => {
    const secondPartialPaymentAmount = sale.total - sale.partialPaymentAmount;
    return { secondPartialPaymentAmount };
  });

  let recivedAmount = 0;
  let toBeRecivedAmount = 0;

  const secondPartialAmountRecived = completeModifiedSales.forEach((sale) => {
    recivedAmount += sale.secondPartialPaymentAmount;
  });
  const secondPartialAmountToBeRecived = incompleteModifiedSales.forEach(
    (sale) => {
      toBeRecivedAmount += sale.secondPartialPaymentAmount;
    }
  );

  res.status(200).json({
    success: true,
    secondPartialAmountRecived: recivedAmount,
    secondPartialAmountToBeRecived: toBeRecivedAmount,
  });
});

export const salesAndPartialPayments = catchAsyncError(
  async (req, res, next) => {
    const { startDate, endDate, branch } = req.query;

    const secondPartialPayments = await Sale.find({
      partialAmountPayingDate: {
        $gte: moment(startDate).startOf("day").toDate(),
        $lte: moment(endDate).endOf("day").toDate(),
      },
      branch: branch ? branch : { $exists: true },
    });

    const salesAndFirstPartialPayment = await Sale.find({
      createdAt: {
        $gte: moment(startDate).startOf("day").toDate(),
        $lte: moment(endDate).endOf("day").toDate(),
      },
      branch: branch ? branch : { $exists: true },
    });

    const allSales = [];

    [...secondPartialPayments, ...salesAndFirstPartialPayment].forEach(
      (sale) => {
        const available = allSales.find((s) => s._id.equals(sale._id));
        if (!available) allSales.push(sale);
      }
    );

    res.status(200).json({
      success: true,
      allSales,
    });
  }
);
