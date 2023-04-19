import ErrorHandler from "../../middlewares/error/errorHandler.js";
import Branch from "../../models/branchModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";

// adding new moderators to the branch
export const addModeratorsToBranch = catchAsyncError(async (req, res, next) => {
  // getting branch id from params
  const { branchId } = req.params;
  // getting branch id from request body
  const { moderatorId } = req.body;

  // sending error if branch or moderator id is not provided
  if (!branchId || !moderatorId) {
    return next(
      new ErrorHandler(400, "Branch ID and Moderator ID are required")
    );
  }

  /**
   * searching branch with the branch id and
   * pushing the moderator id in moderators array of branch
   */

  const branch = await Branch.findByIdAndUpdate(
    branchId,
    {
      $addToSet: { moderators: moderatorId },
    },
    { new: true }
  );

  /**
   * sending the response
   */
  res.status(200).json({
    success: true,
    branch,
  });
});

// deleting new moderators to the branch
export const deleteModeratorFromBranch = catchAsyncError(
  async (req, res, next) => {
    // getting branch id from params
    const { branchId } = req.params;
    // getting branch id from request body
    const { moderatorId } = req.body;

    // sending error if branch or moderator id is not provided
    if (!branchId || !moderatorId) {
      return next(
        new ErrorHandler(400, "Branch ID and Moderator ID are required")
      );
    }

    /**
     * searching branch with the branch id and
     * deleting the moderator id in moderators array of branch
     */

    const branch = await Branch.findByIdAndUpdate(
      branchId,
      {
        $pull: { moderators: moderatorId },
      },
      { new: true }
    );

    /**
     * sending the response
     */
    res.status(200).json({
      success: true,
      branch,
    });
  }
);
