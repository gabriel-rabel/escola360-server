import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, require: true },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model("Notification", notificationSchema);
