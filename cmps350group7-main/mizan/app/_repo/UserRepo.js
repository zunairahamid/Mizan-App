import prisma from "@/lib/prisma";


class UserRepo {
  async getUser(id) {
    return await prisma.user.findUnique({
      where: { id: Number(id) },
    });
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      throw new Error("Incorrect username or password.");
    }

    delete user.password;
    user.name = `${user.firstName} ${user.lastName}`;
    user.isStudent = user.role === "Student";
    user.isInstructor = user.role === "Instructor";
    user.isCoordinator = user.role === "Coordinator";

    return user;
  }
}

export default new UserRepo();
