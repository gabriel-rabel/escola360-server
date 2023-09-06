import express from "express";
import isAuth from "../middlewares/isAuth.js";
import SchoolModel from "../model/school.model.js";
import NotificationModel from "../model/notification.model.js";

const notfRouter = express.Router();

//criar um job
notfRouter.post("/create", isAuth, async (req, res) => {
  try {
    const form = req.body;
    const id_school = req.auth._id;

    const notfCreated = await NotificationModel.create({
      ...form,
      school: id_school,
    });

    //adicionar o id do job recem criado dentro da array offers do school
    await SchoolModel.findByIdAndUpdate(id_school, {
      $push: { notifications: notfCreated._id },
    });

    return res.status(201).json(notfCreated);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});
export default notfRouter;
