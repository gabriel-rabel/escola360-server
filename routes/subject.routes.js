import express from "express";
import isAuth from "../middlewares/isAuth.js";
import SchoolModel from "../model/school.model.js";
import SubjectModel from "../model/subject.model.js";

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

export default subjectRouter;
