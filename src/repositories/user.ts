export class UserRepository {
  readonly users: any[] = [];

  create(user: any) {
    this.users.push(user);
    return { name: user.name, email: user.email };
  }
}
