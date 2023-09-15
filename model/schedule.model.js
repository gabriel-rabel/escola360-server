import { Schema, model } from "mongoose";

const scheduleSchema = new Schema(
  {
    user: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
    subjects: [
      { type: Schema.Types.ObjectId, required: false, ref: "Subject" },
    ],
    status: {
      type: String,
      enum: ["ABERTA", "FECHADA", "CANCELADA"],
      default: "ABERTA",
    },
  },
  { timestamps: true }
);

export default model("Schedule", scheduleSchema);
