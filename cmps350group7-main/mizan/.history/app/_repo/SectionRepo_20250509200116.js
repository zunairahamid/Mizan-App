import fs from "fs-extra";
import path from "path";

class SectionRepo {
  constructor() {
    this.sectionFilePath = path.join(process.cwd(), "data/sections.json");
  }

  async #readSections() {
    return await prisma.section.findMany({});
  }

  async getSectionById(sectionCRN) {
    return await prisma.section.findUnique({
      where: {
        crn: sectionCRN,
      },
    });
  }

  async getSections(user, semesterId) {
   return await prisma.section.findMany({
where:{crn:semesterId},
})
}
}
export default new SectionRepo();