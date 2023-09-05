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

      cnpj: { type: Number },

      logo: {
         type: String,
         default: "https://cdn.wallpapersafari.com/92/63/wUq2AY.jpg",
      },

      role: { type: String, enum: ["SCHOOL", "USER"], default: "SCHOOL" },

      description: {type: String},

      telefone: { type: String, required: true, trim: true },

      endereco: { type: String, required: true },

      passwordHash: { type: String, required: true },

      active: {type: Boolean, default: true},

      notifications: [ {type: Schema.Types.ObjectId, ref: "Notification"} ], 

      students: [ {type: Schema.Types.ObjectId, ref: "User", required: true} ],

      menu: { type: String },
   },
   // o que mais eu posso colocar nas opcoes do schema?
   { timestamps: true }
);

export default model("School", schoolSchema);
