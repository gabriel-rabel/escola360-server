import express from "express";
import bcrypt from "bcrypt";
import generateToken from "../config/jwt.config.js";
import isAuth from "../middlewares/isAuth.js";
import SchoolModel from "../model/school.model.js";
import UserModel from "../model/user.model.js";
import ScheduleModel from "../model/schedule.model.js";
import schoolModel from "../model/school.model.js";

const schoolRouter = express.Router();

// variáveis em MAISCULO são consideradas GERAIS
const SALT_ROUNDS = 10; // quão complexo queremos que o salt seja criado || maior o numero MAIOR a demora na criação da hash

// http://localhost:4000/school/signup
schoolRouter.post("/signup", async (req, res) => {
  //testado funcionando 07/09/23
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
    console.log("caiu no erro de rota");
    return res.status(500).json(err.message);
  }
});

// http://localhost:4000/school/login
schoolRouter.post("/login", async (req, res) => {
  //testado funcionando 07/09/23
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
        user: school, // verificar isso creio que seja user.
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
    console.log("Erro de conexao ao banco de dados");
    return res.status(500).json(err.message);
  }
});

// http://localhost:4000/school/profile
schoolRouter.get("/profile", isAuth, async (req, res) => {
  // testado e funcionando 07/09/23
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

// http://localhost:4000/school/edit
schoolRouter.put("/edit", isAuth, async (req, res) => {
  //testado e funcionando 07/09/23
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
    console.log("Erro na rota");
    return res.status(500).json(error);
  }
});

//edicoes de usuario aluno// -->

// http://localhost:4000/user/profile
schoolRouter.get("/get_one/:id_student", isAuth, async (req, res) => {
  //funcionando e testado 07/09/23
  try {
    const id_student = req.params.id_student;

    const student = await UserModel.findById(id_student).select(
      "-passwordHash"
    );

    return res.status(200).json(student);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// // rota de edit para a escola editar o aluno
// // http://localhost:4000/school/edit_one/:id_student
schoolRouter.put("/edit_one/:id_student", isAuth, async (req, res) => {
  try {
    const id_student = req.params.id_student;
    const user = req.body;

    const updatedData = { ...req.body };

    // Verifique se a senha está presente no req.body e não está vazia
    if (updatedData.password) {
      // Verifique a senha em relação aos requisitos
      if (
        !updatedData.password.match(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
        )
      ) {
        throw new Error(
          "A senha não preenche os requisitos básicos. 8 caracteres. Maiúsculas e minúsculas. Números e caracteres especiais."
        );
      }

      // Hash da nova senha
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(updatedData.password, salt);

      // Atualize a senha no objeto a ser atualizado
      updatedData.passwordHash = hashedPassword;

      // Remova a senha do objeto para evitar atualizar a senha com um campo vazio
      delete updatedData.password;
    }

    const updatedStudent = await UserModel.findByIdAndUpdate(
      id_student,
      updatedData,
      { new: true, runValidators: true }
    );
    updatedStudent.passwordHash = undefined;

    return res.status(200).json(updatedStudent);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  }
});

// Delete Student by ID
schoolRouter.delete("/delete/:id_student", isAuth, async (req, res) => {
  //testado e funcionando 07/09/23
  try {
    const id_student = req.params.id_student;

    const updatedStudent = await UserModel.findByIdAndUpdate(
      id_student,
      { active: false },
      { new: true, runValidators: true }
    );
    return res.status(200).json(updatedStudent);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//criar um cronograma no aluno
// http://localhost:4000/school/schedule/create
schoolRouter.post("/schedule/create", isAuth, async (req, res) => {
  try {
    const form = req.body;
    const id_user = form.student;

    // Obtenha a lista de IDs das matérias selecionadas
    const selectedSubjectIds = form.subjects;

    // Crie um único cronograma com os assuntos selecionados
    const schCreated = await ScheduleModel.create({
      user: id_user,
      bimester: form.bimester,
      subjects: selectedSubjectIds, // Use a lista de IDs das matérias
    });

    // Adicione o ID do cronograma criado ao usuário
    const updatedStudent = await UserModel.findByIdAndUpdate(
      id_user,
      {
        $push: { schedules: schCreated._id }, // Adicione o ID do cronograma
      },
      { new: true, runValidators: true }
    );

    return res.status(201).json(updatedStudent);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//GET ALL SCHEDULES
// http://localhost:4000/school/schedule/get_all
schoolRouter.get("/schedule/get_all", isAuth, async (req, res) => {
  try {
    const schedulesAll = await ScheduleModel.find();

    return res.status(200).json(schedulesAll);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// testando gets
schoolRouter.get("/schedule/get/bimester1", isAuth, async (req, res) => {
  try {
    const schedulesBim = await ScheduleModel.find({ bimester: "1bim" });

    return res.status(200).json(schedulesBim);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// testando gets
// GET SCHEDULES BY BIMESTER
// http://localhost:4000/school/schedule/get_by_bimester/1bim
schoolRouter.get(
  "/schedule/get_by_bimester/:bimester",
  isAuth,
  async (req, res) => {
    try {
      const bimester = req.params.bimester;

      const schedulesByBimester = await ScheduleModel.find({ bimester });

      return res.status(200).json(schedulesByBimester);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);
export default schoolRouter;

//OUTRAS ROTAS DO SCHEDULE Q N TESTEI
/*

scheduleRouter.get("/get_one/:id_schedule", isAuth, async (req, res) => {
  try {
    const id_schedule = req.params.id_schedule;
    const schedule = await ScheduleModel.findById(id_schedule);

    return res.status(200).json(schedule);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//edit schedule
// http://localhost:4000/schedule/edit/:id_schedule
scheduleRouter.put("/edit/:id_schedule", isAuth, async (req, res) => {
  try {
    const id_schedule = req.params.id_schedule;
    const form = req.body;

    const updatedSchedule = await ScheduleModel.findByIdAndUpdate(
      id_schedule,
      { ...form },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedSchedule);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// SOFT DELETE
scheduleRouter.delete("/delete/:id_schedule", isAuth, async (req, res) => {
  try {
    const id_schedule = req.params.id_schedule;

    const deletedSchedule = await ScheduleModel.findByIdAndUpdate(
      id_schedule,
      { status: "CANCELADA" },
      { new: true, runValidators: true }
    );

    return res.status(200).json(deletedSchedule);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//adicionar materia no aluno

scheduleRouter.post("/add_schedule", isAuth, async (req, res) => {
  try {
    const form = req.body;

    //adicionar algo na array do usuario
    const updatedStudent = await UserModel.findByIdAndUpdate(
      //testado e funcionando 07/09/23
      form.id_student,
      {
        $push: { schedule: form.id_schedule },
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedStudent);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//deletar materia do usuario

scheduleRouter.delete("/delete_schedule", isAuth, async (req, res) => {
  try {
    const form = req.body;

    //adicionar algo na array do usuario
    const updatedStudent = await UserModel.findByIdAndUpdate(
      //testado e funcionando 07/09/23
      form.id_student,
      {
        $pull: { schedule: form.id_schedule },
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedStudent);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
*/
