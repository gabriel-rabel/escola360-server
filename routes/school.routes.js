import express from "express";
import bcrypt from "bcrypt";
import generateToken from "../config/jwt.config.js";
import isAuth from "../middlewares/isAuth.js";
import SchoolModel from "../model/school.model.js";

const schoolRouter = express.Router();

// variáveis em MAISCULO são consideradas GERAIS
const SALT_ROUNDS = 10; // quão complexo queremos que o salt seja criado || maior o numero MAIOR a demora na criação da hash

// http://localhost:4000/school/signup
schoolRouter.post("/signup", async (req, res) => {
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

    const school = await SchoolModel.create({
      ...form,
      passwordHash: hashedPassword,
    });

    school.passwordHash = undefined;

    return res.status(201).json(school);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err.message);
  }
});

// http://localhost:4000/school/login
schoolRouter.post("/login", async (req, res) => {
  try {
    const form = req.body;

    if (!form.email || !form.password) {
      throw new Error("Por favor, preencha todos os dados!");
    }

    // procuro o user pelo email dentro do banco de dados
    const school = await SchoolModel.findOne({ email: form.email });

    //compare() também retorna TRUE se for igual as senhas e retorna FALSE se a senha não foi igual!!
    if (await bcrypt.compare(form.password, school.passwordHash)) {
      //senhas iguais, pode fazer login

      //gerar um token
      const token = generateToken(school);

      school.passwordHash = undefined;

      return res.status(200).json({
        school: school,
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

// http://localhost:4000/school/profile
schoolRouter.get("/profile", isAuth, async (req, res) => {
  try {
    const id_school = req.auth._id;

    const school = await SchoolModel.findById(id_school).select(
      "-passwordHash"
    );

    return res.status(200).json(school);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

schoolRouter.put("/edit", isAuth, async (req, res) => {
  try {
    const id_school = req.auth._id;

    const updatedSchool = await SchoolModel.findByIdAndUpdate(
      id_school,
      { ...req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedSchool);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

export default schoolRouter;
