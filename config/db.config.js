import mongoose from "mongoose";

export default async function connectToDB() {
   try {
      const dbConnect = await mongoose.connect(process.env.MONGODB_URI);

      console.log(`Connected to db: ${dbConnect.connection.name}`);
   } catch (err) {
      console.log("Error connecting to database: ", err.message);
      console.log(err);
   }
}
