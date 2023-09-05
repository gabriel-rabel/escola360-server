import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/, // match = regex
    },

    class: { type: String, required: true },

    register: { type: String, required: true, trim: true },

    profilePicture: {
      type: String,
      default: "https://cdn.wallpapersafari.com/92/63/wUq2AY.jpg",
    },

    role: { type: String, enum: ["SCHOOL", "USER"], default: "USER" },

    passwordHash: { type: String, required: true },

    active: { type: Boolean, default: true },

    grade: [{ type: Schema.Types.ObjectId, ref: "Subject" }],

    firstBimester: [
      {
        subject: { type: Schema.Types.ObjectId, ref: "Subject" },
        note: { type: Number },
        missed: { type: Number },
      },
    ],

    secondBimester: [
      {
        subject: { type: Schema.Types.ObjectId, ref: "Subject" },
        note: { type: Number },
        missed: { type: Number },
      },
    ],

    thirdBimester: [
      {
        subject: { type: Schema.Types.ObjectId, ref: "Subject" },
        note: { type: Number },
        missed: { type: Number },
      },
    ],

    fourthBimester: [
      {
        subject: { type: Schema.Types.ObjectId, ref: "Subject" },
        note: { type: Number },
        missed: { type: Number },
      },
    ],

    finalGrade: [
      {
        subject: { type: Schema.Types.ObjectId, ref: "Subject" },
        note: { type: Number },
        missed: { type: Number },
      },
    ],
  },
  // o que mais eu posso colocar nas opcoes do schema?
  { timestamps: true }
);

export default model("User", userSchema);
