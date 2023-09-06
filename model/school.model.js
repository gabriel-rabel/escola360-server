import { Schema, model } from "mongoose";

const schoolSchema = new Schema(
   {
      name: { type: String, required: true, trim: true },

      email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/, // math = regex
      },

      cnpj: { type: String },

      logo: {
         type: String,
         default: "https://cdn.wallpapersafari.com/92/63/wUq2AY.jpg",
      },

      description: {type: String},

      phone: { type: String, required: true, trim: true },

      address: { type: String, required: true },

      passwordHash: { type: String, required: true },

      notifications: [ { type: Schema.Types.ObjectId, ref: "Notification" } ], 

      menu: { type: String },
   },
   { timestamps: true }
);

export default model("School", schoolSchema);
