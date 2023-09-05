//express-jwt -> responsável por VALIDAR o token
import { expressjwt } from "express-jwt";
import * as dotenv from "dotenv";
dotenv.config();

export default expressjwt({
   secret: process.env.TOKEN_SIGN_SECRET,
   algorithms: ["HS256"],
});

// REQ.AUTH -> as informações que estão dentro do token serão colocadas nessa propriedade do objeto req.
