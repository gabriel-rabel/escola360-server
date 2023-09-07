import cors from "cors"; // Cross Origin Resource Sharing - Quem vai poder fazer requisições para o meu servidor
import * as dotenv from "dotenv"; // esconder e acessar nossas variáveis de ambiente
import express from "express";
import connectToDB from "./config/db.config.js";

import userRouter from "./routes/user.routes.js";
import uploadRoute from "./routes/upload.routes.js";
import notfRouter from "./routes/notification.routes.js";
import subjectRouter from "./routes/subject.routes.js";
import schoolRouter from "./routes/school.routes.js";

dotenv.config();

const app = express();

app.use(cors()); // cors() => Aceita a requisição de TODO MUNDO
app.use(express.json()); // configuração do servidor para aceitar e receber arquivos em json

app.use("/user", userRouter);

app.use("/school", schoolRouter);

app.use("/upload", uploadRoute);

app.use("/notification", notfRouter);

app.use("/subject", subjectRouter);

connectToDB()
  .then(
    app.listen(process.env.PORT, () => {
      console.log(`Server up and running at port ${process.env.PORT}`);
    })
  )
  .catch((error) => {
    console.log("Error connecting to database: ", error);
  });
