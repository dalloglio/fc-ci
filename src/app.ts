import express from "express";
import { UserController } from "./controllers/user";
import { UserRepository } from "./repositories/user";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post("/users", (req, res) => {
  const { name, email, password } = req.body;
  const userRepository = new UserRepository();
  const userController = new UserController(userRepository);
  const result = userController.create({ name, email, password });
  res.status(201).json(result);
});

export default app;
