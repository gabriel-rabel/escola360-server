import { Schema, model } from "mongoose";

const subjectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    teacher: { type: String, required: true },
    active: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["ABERTA", "FECHADA", "CANCELADA"],
      default: "ABERTA",
    },
  },
  { timestamps: true }
);

export default model("Subject", subjectSchema);
