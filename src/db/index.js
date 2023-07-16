import mongoose from "mongoose";

// Connect to MongoDB

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.LOCAL_DATABSE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Database Connected...");
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
