import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    parentsName: { type: String, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/, // match = regex
    },

    class: { type: String, required: true },

    register: { type: String, required: true, trim: true, unique: true },

    profilePicture: {
      type: String,
      default: "https://cdn.wallpapersafari.com/92/63/wUq2AY.jpg",
    },

    passwordHash: { type: String, required: true },

    active: { type: Boolean, default: true },

    schedule: [{ type: Schema.Types.ObjectId, ref: "Subject" }],

    schedules: [{ type: Schema.Types.ObjectId, ref: "Schedule" }],

    notifications: [{ type: Schema.Types.ObjectId, ref: "Notification" }],

    firstBimester: [
      {
        subject: { type: String },
        note: { type: String },
        missed: { type: String },
      },
    ],

    secondBimester: [
      {
        subject: { type: String },
        note: { type: String },
        missed: { type: String },
      },
    ],

    thirdBimester: [
      {
        subject: { type: String },
        note: { type: String },
        missed: { type: String },
      },
    ],

    fourthBimester: [
      {
        subject: { type: String },
        note: { type: String },
        missed: { type: String },
      },
    ],

    finalSchedule: [
      {
        subject: { type: String },
        note: { type: String },
        missed: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default model("User", userSchema);
