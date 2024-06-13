import { UserRepository } from "./user";

describe("UserRepository", () => {
  it("should create user", () => {
    const userRepository = new UserRepository();
    userRepository.create({});
    expect(userRepository.users).toHaveLength(1);
  });
});
