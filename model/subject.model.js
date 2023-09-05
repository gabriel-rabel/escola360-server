import { Schema, model} from "mongoose"

const subjectSchema = new Schema({
    title: { type: String, required: true },
    description: {type: String, require: true },
    school: { type: Schema.Types.ObjectId, ref: "School", required: true },
    active: { type: Boolean, default: true },
},
{ timestamps: true }
);

export default model("Subject", subjectSchema);