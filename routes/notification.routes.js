import express from "express";
import isAuth from "../middlewares/isAuth.js";
import SchoolModel from "../model/school.model.js";
import NotificationModel from "../model/notification.model.js";
import UserModel from "../model/user.model.js";

const notfRouter = express.Router();

//get one notification
notfRouter.get("/get_one/:id_notification", isAuth, async (req, res) => {
  try {
    const id_notification = req.params.id_notification;
    const notification = await NotificationModel.findById(id_notification);

    return res.status(200).json(notification);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

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

//criar uma notificacao no aluno
// http://localhost:4000/notification/create
notfRouter.post("/create", isAuth, async (req, res) => {
  try {
    const form = req.body;
    const id_school = req.auth._id;

    const notfCreated = await NotificationModel.create({
      ...form,
      school: id_school,
    });

    // Encontrar todos os alunos
    const allStudents = await UserModel.find({});

    // Atualizar a escola
    await SchoolModel.findByIdAndUpdate(id_school, {
      $push: { notifications: notfCreated._id },
    });

    // Iterar sobre todos os alunos e adicionar a notificação às suas arrays de notificações
    for (const student of allStudents) {
      await UserModel.findByIdAndUpdate(student._id, {
        $push: { notifications: notfCreated._id },
      });
    }

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
    const delectedNotification = await NotificationModel.findByIdAndDelete(
      id_notification
    );

    // Remover o ID da notificação da array de notificações da escola
    // ta deletando mas esta retornando erro, verificar
    //await SchoolModel.findByIdAndUpdate(id_school, {
    //  $pull: { notifications: id_notification },
    // });

    return res.status(200).json(delectedNotification);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// Get de notificações não lidas
notfRouter.get("/get_unread", isAuth, async (req, res) => {
  try {
    // Find all unread notifications for the user
    const unreadNotifications = await NotificationModel.find({
      read: false,
    });

    return res.status(200).json(unreadNotifications);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// Rota para marcar notificações como lidas
notfRouter.put("/mark_as_read", async (req, res) => {
  try {
    // Marcamos todas as notificações do usuário como lidas
    await NotificationModel.updateMany({ read: true });

    return res
      .status(200)
      .json({ message: "Notificações marcadas como lidas" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erro ao marcar notificações como lidas" });
  }
});
export default notfRouter;
