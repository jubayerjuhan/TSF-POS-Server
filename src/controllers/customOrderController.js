import catchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandler from "../middlewares/error/errorHandler.js";
import CustomOrder from "../models/customOrder.js";

// creating custom order
export const createCustomOrder = catchAsyncError(async (req, res, next) => {
  const orderData = req.body;

  const customOrder = new CustomOrder(orderData);
  const savedOrder = await customOrder.save();

  res.status(201).json({
    success: true,
    order: savedOrder,
  });
});

// get custom order by id
export const getCustomOrderById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const order = await CustomOrder.findById(id)
    .populate("branch", "name") // Populating the branch field with the 'name' field
    .populate("products.product", "name"); // Populating the 'product' field within the 'products' array with the 'name' field

  if (!order) {
    return next(new ErrorHandler(404, "Custom Order not found"));
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});
