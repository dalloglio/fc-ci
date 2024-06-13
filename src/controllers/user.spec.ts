import { UserController } from "./user";

const MockRepository = jest.fn().mockImplementation(() => ({
  create: jest.fn(),
}));

describe("UserController", () => {
  it("should create user", () => {
    const repository = new MockRepository();
    const controller = new UserController(repository);
    controller.create({});
    expect(repository.create).toHaveBeenCalledTimes(1);
  });
});
