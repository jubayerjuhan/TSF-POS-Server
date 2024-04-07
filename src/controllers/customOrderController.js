import catchAsyncError from "../utils/catchAsyncError.js";
import ErrorHandler from "../middlewares/error/errorHandler.js";
import CustomOrder from "../models/customOrder.js";
import Branch from "../models/branchModel.js";
import moment from "moment";
import "moment-timezone";
import { uploadImage, uploadImageArray } from "../utils/uploadImage/uploadImage.js";

// creating custom order
export const createCustomOrder = catchAsyncError(async (req, res, next) => {
  const orderData = req.body;
  const photos = req.files;

  const imageURLs = await uploadImageArray(photos);


  const customOrder = new CustomOrder({ ...orderData, photos: imageURLs });
  const savedOrder = await customOrder.save();

  res.status(201).json({
    success: true,
    order: savedOrder,
  });
});

// edit custom order color wood and total price
export const editCustomOrder = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const orderData = req.body;
  const orderPhotos = req.files;

  console.log(orderPhotos, "orderPhotos")
  const imageURLs = await uploadImageArray(orderPhotos);

  console.log(imageURLs, "imageURLs")

  const order = await CustomOrder.findById(id);

  if (!order) {
    return next(new ErrorHandler(404, "Custom Order not found"));
  }

  try {
    const updatedOrder = await CustomOrder.findByIdAndUpdate(id, { ...orderData, photos: [...order?.photos, ...imageURLs] }, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      order: updatedOrder,
    });

  } catch (error) {
    return next(new ErrorHandler(400, error.message));
  }
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
    orders,
  });
});

// get custom order by id
export const getCustomOrderById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const order = await CustomOrder.findById(id)
    .populate("branch", "name") // Populating the branch field with the 'name' field
    .populate("products.product"); // Populating the 'product' field within the 'products' array with the 'name' field

  if (!order) {
    return next(new ErrorHandler(404, "Custom Order not found"));
  }

  res.status(200).json({
    success: true,
    order,
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

    console.log("64c2a79301b47e1a34d4f7a8", "Factory Branch Id.....!!!!!!!!!!!!")
    const factoryBranch = await Branch.findById("64c2a79301b47e1a34d4f7a8");

    console.log(order, "order")
    console.log(factoryBranch, "factory branch")

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

    if (status === "Shipped") {
      console.log(factoryBranch, "factory branch!!!!!!!!!!!!!!!");
      for (const productId of productIds) {
        const product = factoryBranch?.products.find((pd) =>
          pd.id.equals(productId.id)
        );

        console.log(product, productId, "product and productId");
        console.log(product?.quantity, productId.quantity, "product and productId quantity")
        console.log(product.quantity < productId.quantity, "product.quantity < productId.quantity")

        if (!product || (product.quantity < productId.quantity)) {
          return next(
            new ErrorHandler(400, "Insufficient Product Quantity Available...")
          );
        }
      }
    }

    if (status === "Delivered") {
      order.deliveredAt = moment();
    }
    order.status = status;

    if (order.status === "Delivered") {
      const orderBranch = await Branch.findById(order.branch._id);
      console.log(orderBranch, "orderBranch before");
      order.products.forEach((orderProduct) => {
        orderBranch.products.forEach((branchProduct) => {
          if (branchProduct.id.toString() === orderProduct.product.toString()) {
            // Reduce the quantity of the matched product in the branch
            branchProduct.quantity -= orderProduct.quantity;
          }
        });
      });

      // Save the updated branch with reduced quantities
      await orderBranch.save();
    }

    if (status === "Shipped") {
      console.log(order, "order...")
      order.products = productIds.map((productId) => ({
        product: productId.id,
        quantity: productId.quantity,
      }));

      for (const productId of productIds) {
        await moveTheProductToTheBranch(
          order.branch,
          productId.id,
          productId.quantity,
          next
        );
      }
    }

    const updatedOrder = await order.save();

    const orderToDispatch = await CustomOrder.findById(updatedOrder._id)
      .populate("branch", "name") // Populating the branch field with the 'name' field
      .populate("products.product"); // Populating the 'product' field within the 'products' array with the 'name' field

    res.status(200).json({
      success: true,
      message: "Order Status Updated",
      order: orderToDispatch,
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
  const branch = await Branch.findOne({ _id: "64c2a79301b47e1a34d4f7a8" });

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
    { _id: "64c2a79301b47e1a34d4f7a8", "products.id": productId },
    { $inc: { "products.$.quantity": -quantity } },
    { new: true }
  );

  // Increase the product quantity in the target branch
  const toBranchInfo = await Branch.findOne(toBranch);

  const existProduct = toBranchInfo.products.find((pd) =>
    pd.id.equals(productId)
  );

  if (existProduct) {
    existProduct.quantity = existProduct.quantity + quantity;
  } else {
    toBranchInfo.products.push({ id: productId, quantity });
  }

  await toBranchInfo.save();
};

export const getCustomOrderAmount = catchAsyncError(async (req, res, next) => {
  const { branchId, fromDate, toDate } = req.query;

  // Convert the start and end dates to Bangladesh time
  const startOfDayBangladesh = fromDate
    ? moment.tz(fromDate, "Asia/Dhaka").startOf("day").toDate()
    : undefined;
  const endOfDayBangladesh = toDate
    ? moment.tz(toDate, "Asia/Dhaka").endOf("day").toDate()
    : undefined;

  let query = CustomOrder.find();

  if (branchId) {
    query = query.where("branch").equals(branchId);
  }

  if (fromDate && toDate) {
    query = query
      .where("createdAt")
      .gte(startOfDayBangladesh)
      .lte(endOfDayBangladesh);
  }

  const orders = await query
    .populate("branch", "name")
    .populate("products.product");

  let completedOrdersQuery = {};

  if (branchId) {
    completedOrdersQuery = {
      deliveredAt: { $gte: startOfDayBangladesh, $lte: endOfDayBangladesh },
      branch: branchId,
    };
  } else {
    // Separate moments for completedOrders query
    const startOfDayBangladeshForCompletedOrders = startOfDayBangladesh
      ? moment.tz(fromDate, "Asia/Dhaka").startOf("day").toDate()
      : undefined;
    completedOrdersQuery = {
      deliveredAt: {
        $gte: startOfDayBangladeshForCompletedOrders,
        $lte: endOfDayBangladesh,
      },
    };
  }

  const completedOrders = await CustomOrder.find(completedOrdersQuery);

  let advancePayment = 0;
  let fullPayment = 0;

  orders.forEach((order) => {
    advancePayment += order.advancePayment;
  });

  completedOrders.forEach((completedOrder) => {
    fullPayment += completedOrder.totalPrice - completedOrder.advancePayment;
  });

  res.status(200).json({
    success: true,
    orders,
    amount: {
      totalRevenue: advancePayment + fullPayment,
      advancePayment,
      fullPayment,
    },
  });
});
