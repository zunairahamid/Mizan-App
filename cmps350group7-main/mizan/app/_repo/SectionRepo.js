import fs from "fs-extra";
import path from "path";
import prisma from "@/lib/prisma";

class SectionRepo {
  async getSectionById(sectionCRN) {
    return await prisma.section.findUnique({
      where: { crn: sectionCRN },
    });
  }

  async getSections(user, semesterId) {
    return await prisma.section.findMany({
      where: {
        semester: semesterId,
      },
      orderBy: { courseName: "asc" },
    });
  }
}

export default new SectionRepo();
