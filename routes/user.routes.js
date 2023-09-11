import express from "express";
import UserModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../config/jwt.config.js";
import isAuth from "../middlewares/isAuth.js";

const userRouter = express.Router();

// variáveis em MAISCULO são consideradas GERAIS
const SALT_ROUNDS = 10; // quão complexo queremos que o salt seja criado || maior o numero MAIOR a demora na criação da hash

// http://localhost:4000/user/signup
userRouter.post("/signup", async (req, res) => {
  try {
    const form = req.body;

    console.log(form);

    if (!form.email || !form.password) {
      throw new Error("Por favor, envie um email e uma senha");
    }

    if (
      form.password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
      ) === false
    ) {
      throw new Error(
        "A senha não preenche os requisitos básicos. 8 caracteres. Maiuscula e minuscula. Numeros e caracteres especiais."
      );
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(form.password, salt);

    const user = await UserModel.create({
      ...form,
      passwordHash: hashedPassword,
    });

    user.passwordHash = undefined;

    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err.message);
  }
});

// http://localhost:4000/user/login
userRouter.post("/login", async (req, res) => {
  try {
    const form = req.body;

    if (!form.email || !form.password) {
      throw new Error("Por favor, preencha todos os dados!");
    }

    // procuro o user pelo email dentro do banco de dados
    const user = await UserModel.findOne({ email: form.email });

    //compare() também retorna TRUE se for igual as senhas e retorna FALSE se a senha não foi igual!!
    if (await bcrypt.compare(form.password, user.passwordHash)) {
      //senhas iguais, pode fazer login

      //gerar um token
      const token = generateToken(user);

      user.passwordHash = undefined;

      return res.status(200).json({
        user: user,
        token: token,
      });
    } else {
      //senhas diferentes, não pode fazer login
      throw new Error(
        "Email ou senha não são válidos. Por favor tenta novamente."
      );
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err.message);
  }
});

// http://localhost:4000/user/profile
userRouter.get("/profile", isAuth, async (req, res) => {
  try {
    const id_user = req.auth._id;

    const user = await UserModel.findById(id_user).select("-passwordHash").populate("schedule").populate("firstBimester.subject").populate("secondBimester.subject").populate("thirdBimester.subject").populate("fourthBimester.subject").populate("finalSchedule.subject");
        return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//GET ALL
// http://localhost:4000/user/get_all
userRouter.get("/get_all", isAuth, async (req, res) => {
  try {
    const allUsers = await UserModel.find();

    return res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});



export default userRouter;
