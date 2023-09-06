import { Schema, model} from "mongoose"

const subjectSchema = new Schema({
    name: { type: String, required: true },
    description: {type: String, require: true },
    teacher: { type: String, require: true },
},
{ timestamps: true }
);

export default model("Subject", subjectSchema);