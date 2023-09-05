import { Schema, model } from "mongoose";

const userSchema = new Schema(
   {
      email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/, // match = regex
      },

      profilePicture: {
         type: String,
         default: "https://cdn.wallpapersafari.com/92/63/wUq2AY.jpg",
      },

      passwordHash: { type: String, required: true },
   },
   // o que mais eu posso colocar nas opcoes do schema?
   { timestamps: true }
);

export default model("User", userSchema);
