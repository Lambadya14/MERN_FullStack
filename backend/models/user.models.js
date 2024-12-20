import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "client" },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dyxdhodds/image/upload/v1734691150/d4el1zq5vrpjjsvau63o.svg",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
