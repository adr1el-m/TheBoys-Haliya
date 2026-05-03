import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointment,
  updateAppointment,
} from "../controllers/appointmentControllers.js";

const router = express.Router();

// router.use(verifyJWT);
router
  .get("/", getAllAppointments)
  .get("/:id", getAppointment)
  .post("/create", createAppointment)
  .patch("/update/:id", updateAppointment);

export default router;
