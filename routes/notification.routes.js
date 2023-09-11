import express from "express";
import isAuth from "../middlewares/isAuth.js";
import SchoolModel from "../model/school.model.js";
import NotificationModel from "../model/notification.model.js";

const notfRouter = express.Router();


//get all notifications

notfRouter.get("/get_all", isAuth, async (req, res) => {
  try {
    const notificationsAll = await NotificationModel.find();
    return res.status(200).json(notificationsAll);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//criar uma notificacao
// http://localhost:4000/notification/create
notfRouter.post("/create", isAuth, async (req, res) => {
  try {
    const form = req.body;
    const id_school = req.auth._id;

    const notfCreated = await NotificationModel.create({
      ...form,
      school: id_school,
    });

    //adicionar o id do job recem criado dentro da array notifications do school
    await SchoolModel.findByIdAndUpdate(id_school, {
      $push: { notifications: notfCreated._id },
    });

    return res.status(201).json(notfCreated);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//edit notification
// http://localhost:4000/notification/edit/:id_notification
notfRouter.put("/edit/:id_notification", isAuth, async (req, res) => {
  try {
    const id_notification = req.params.id_notification;
    const form = req.body;

    const updatedNotification = await NotificationModel.findByIdAndUpdate(
      id_notification,
      { ...form },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedNotification);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// deletar notificacao
// http://localhost:4000/notification/delete/:id
notfRouter.delete("/delete/:id_notification", isAuth, async (req, res) => {
  try {
    const id_notification = req.params.id_notification;

    // Deletar notificacao
    await NotificationModel.findByIdAndDelete(id_notification);

    // Remover o ID da notificação da array de notificações da escola
    // ta deletando mas esta retornando erro, verificar
    await SchoolModel.findByIdAndUpdate(id_school, {
      $pull: { notifications: id_notification },
    });

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

export default notfRouter;
