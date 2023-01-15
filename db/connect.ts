import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const connectDB = async (url: string): Promise<typeof mongoose> => {
  return await mongoose.connect(url);
};
export default connectDB;
