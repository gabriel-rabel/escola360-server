import express from "express";
import isAuth from "../middlewares/isAuth.js";
import SchoolModel from "../model/school.model.js";
import SubjectModel from "../model/subject.model.js";
import UserModel from "../model/user.model.js";

const subjectRouter = express.Router();

//criar uma materia
// http://localhost:4000/subject/create
subjectRouter.post("/create", isAuth, async (req, res) => {
  try {
    const form = req.body;
    const id_school = req.auth._id;

    const subCreated = await SubjectModel.create({
      ...form,
      school: id_school,
    });

    //add o id do subject criado, dentro do array subjects de school
    await SchoolModel.findByIdAndUpdate(id_school, {
      $push: { subjects: subCreated._id },
    });

    return res.status(201).json(subCreated);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//GET ALL
// http://localhost:4000/subject/get_all
subjectRouter.get("/get_all", isAuth, async (req, res) => {
  try {
    const subjectsAll = await SubjectModel.find();

    return res.status(200).json(subjectsAll);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

subjectRouter.get("/get_one/:id_subject", isAuth, async (req, res) => {
  try {
    const id_subject = req.params.id_subject;
    const subject = await  SubjectModel.findById(id_subject);

    return res.status(200).json(subject);

  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//edit subject
// http://localhost:4000/subject/edit/:id_subject
subjectRouter.put("/edit/:id_subject", isAuth, async (req, res) => {
  try {
    const id_subject = req.params.id_subject;
    const form = req.body;

    const updatedSubject = await SubjectModel.findByIdAndUpdate(
      id_subject,
      { ...form },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedSubject);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// SOFT DELETE
subjectRouter.delete("/delete/:id_subject", isAuth, async (req, res) => {
  try {
    const id_subject = req.params.id_subject;

    const deletedSubject = await SubjectModel.findByIdAndUpdate(
      id_subject,
      { status: "CANCELADA" },
      { new: true, runValidators: true }
    );

    return res.status(200).json(deletedSubject);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//adicionar materia no aluno

subjectRouter.post("/add_subject", isAuth, async (req, res) => {
  try {
    const form = req.body;

    //adicionar algo na array do usuario
    const updatedStudent = await UserModel.findByIdAndUpdate( //testado e funcionando 07/09/23
      form.id_student,
      {
        $push: { schedule: form.id_subject },
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

subjectRouter.delete("/delete_subject", isAuth, async (req, res) => {
  try {
    const form = req.body;

    //adicionar algo na array do usuario
    const updatedStudent = await UserModel.findByIdAndUpdate( //testado e funcionando 07/09/23
      form.id_student,
      {
        $pull: { schedule: form.id_subject },
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedStudent);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});



export default subjectRouter;
