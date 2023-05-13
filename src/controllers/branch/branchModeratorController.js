import checkModeratorsBranch from "../../helperFunctions/moderators/checkModeratorsBranch.js";
import ErrorHandler from "../../middlewares/error/errorHandler.js";
import Branch from "../../models/branchModel.js";
import User from "../../models/userModel.js";
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

  const moderator = await User.findOne({ _id: moderatorId, role: "moderator" });
  if (!moderator)
    return next(new ErrorHandler(404, "No moderator found with the id"));

  /**
   * Check if the moderation is already added on another branch
   */
  const isUserModerator = await checkModeratorsBranch(moderator._id);

  if (isUserModerator.length > 0) {
    const alradyManagingBranchName = isUserModerator[0].name;
    return next(
      new ErrorHandler(400, `User already managing ${alradyManagingBranchName}`)
    );
  }

  // adding the user to the branch
  const branch = await Branch.findByIdAndUpdate(
    branchId,
    {
      $addToSet: { moderators: moderatorId },
    },
    { new: true }
  );

  // If There is no branch with the id throw a error
  if (!branch)
    return next(new ErrorHandler(404, "No Branch Found With That Id"));

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
    const { moderatorId } = req.query;

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
      message: "Moderator Deleted",
    });
  }
);
