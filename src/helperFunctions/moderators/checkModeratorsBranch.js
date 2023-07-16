import Branch from "../../models/branchModel.js";

const checkModeratorsBranch = async (moderatorId) => {
  return await Branch.find({
    moderators: {
      $in: [moderatorId],
    },
  }).exec();
};

export default checkModeratorsBranch;
