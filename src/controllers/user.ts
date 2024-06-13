import { UserRepository } from "../repositories/user";

export class UserController {
  constructor(private readonly repository: UserRepository) {}
  create(user: any) {
    const { name, email, password } = user;
    return this.repository.create({ name, email, password });
  }
}
