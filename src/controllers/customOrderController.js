import catchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandler from "../middlewares/error/errorHandler.js";
import CustomOrder from "../models/customOrder.js";
import Branch from "../models/branchModel.js";

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

// Get all custom orders
export const getAllCustomOrders = catchAsyncError(async (req, res, next) => {
  const { branchId } = req.query;

  let query = CustomOrder.find();

  if (branchId) {
    query = query.where("branch").equals(branchId);
  }

  const orders = await query
    .populate("branch", "name") // Populating the branch field with the 'name' field
    .populate("products.product"); // Populating the 'product' field within the 'products' array with the 'name' field

  res.status(200).json({
    success: true,
    data: orders,
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

// delete custom order by id

export const deleteCustomOrder = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const order = await CustomOrder.findByIdAndDelete(id);

  if (!order) {
    return next(new ErrorHandler(404, "Custom Order not found"));
  }

  res.status(200).json({
    success: true,
    message: "Custom Order deleted",
  });
});

export const updateCustomOrderStatus = catchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;
    const { status, productIds } = req.body;

    const order = await CustomOrder.findById(id);

    if (!order) {
      return next(new ErrorHandler(404, "Custom Order not found"));
    }

    if (order.status === "Delivered") {
      return next(new ErrorHandler(500, "Order Already Delivered"));
    }

    if (order.status === status) {
      return next(new ErrorHandler(500, `Order Already ${status}`));
    }

    if (status === "Shipped" && (!productIds || productIds.length === 0)) {
      return next(
        new ErrorHandler(
          400,
          'Product IDs are required when setting status to "Shipped"'
        )
      );
    }

    order.status = status;

    if (status === "Shipped") {
      order.products = productIds.map((productId) => ({
        product: productId.id,
        quantity: productId.quantity,
      }));

      productIds.forEach((productId) => {
        moveTheProductToTheBranch(
          order.branch,
          productId.id,
          productId.quantity,
          next
        );
      });
    } else {
      order.products = [];
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  }
);

const moveTheProductToTheBranch = async (
  toBranch,
  productId,
  quantity,
  next
) => {
  // Find the branch document
  const branch = await Branch.findOne({ _id: process.env.FACTORY_BRANCH_ID });

  // Find the product within the branch's products array
  const product = branch.products.find(
    (product) => product.id.toString() === productId.toString()
  );

  // Check if the product exists and if the available quantity is sufficient
  if (!product || product.quantity < quantity) {
    return next(
      new ErrorHandler(400, "Insufficient Product Quantity Available")
    );
  }

  // Subtract the product quantity from the branch product array
  await Branch.findOneAndUpdate(
    { _id: process.env.FACTORY_BRANCH_ID, "products.id": productId },
    { $inc: { "products.$.quantity": -quantity } },
    { new: true }
  );

  // Increase the product quantity in the target branch
  await Branch.findByIdAndUpdate(
    toBranch,
    {
      $addToSet: { products: { id: productId, quantity: quantity } },
    },
    { new: true }
  );
};
