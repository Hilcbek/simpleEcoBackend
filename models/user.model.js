import mongoose from "mongoose";
let { model, Schema } = mongoose;
let UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profile: {
      type: String,
      default:
        "https://www.nicepng.com/png/full/128-1280406_view-user-icon-png-user-circle-icon-png.png",
    },
  },
  { timestamps: true }
);
export default model("User", UserSchema);
