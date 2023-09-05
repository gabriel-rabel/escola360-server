import { Schema, model} from "mongoose"

const notificationSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, require: true},
    school: {type: Schema.Types.ObjectId, ref: "School", required: true},
    status: {type: String, enum: ["ABERTA", "FECHADA"], default: "ABERTA"},
},
{ timestamps: true }
);

export default model("Notification", notificationSchema);