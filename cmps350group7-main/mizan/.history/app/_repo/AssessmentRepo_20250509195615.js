import fs from "fs-extra";
import path from "path";
import prisma from "@/lib/prisma";
import sectionRepo from "@/app/_repo/SectionRepo";
import { capitalize } from "@/app/actions/utils";

class AssessmentRepo {
  async getAssessmentTypes() {
    return await prisma.assessmentType.findMany();
    //const filePath = path.join(process.cwd(), "data/assessment-types.json");
    //return fs.readJson(filePath);
  }

  constructor() {
    this.assessmentFilePath = path.join(process.cwd(), "data/assessments.json");
  }

  async #readAssessments() {
    return await prisma.assessment.findMany();
  }

  async #writeAssessments(assessment) {
    return prisma.assessment.create({data:assessment});
  }

  async getAssessmentById(id) {
    return prisma.assessment.findUnique({where: {id:id}})
  }

  async getAssessmentsBySection(sectionCRN) {
    return prisma.assessment.findUnique({where: {sectionCRN:sectionCRN}})
  }

  async countAssessmentsByType(sectionCRN, type) {
    const assessments = await prisma.assessment.findMany({
      where: {
        sectionCRN: sectionCRN,
        type: type,
      },
    })
    const count = assessments.length;
    return count;
  }

  async countAssessmentsByDueDate(sectionCRN, dueDate) {
    const assessments = await prisma.assessment.findMany({
      where: {
        sectionCRN: sectionCRN,
        dueDate: dueDate,
      },
    })
    const count = assessments.length;
    return count;
  }

  async #getUserAssessments(user, semesterId) {
    const userSections = await sectionRepo.getSections(user, semesterId);

  }

  async getAssessments(user, semesterId, sectionCRN) {
    if (!user && (!sectionCRN || sectionCRN === "all")) return [];

    const assessments =
      sectionCRN && sectionCRN !== "all"
        ? await this.getAssessmentsBySection(sectionCRN)
        : await this.#getUserAssessments(user, semesterId);

    // Sort by section CRN
    assessments.sort((a, b) => a.sectionCRN.localeCompare(b.sectionCRN));

    // Enrich with section data
    for (const assessment of assessments) {
      assessment.section = await sectionRepo.getSectionById(
        assessment.sectionCRN
      );
    }

    return assessments;
  }

  async addAssessment(assessment) {
    await prisma.assessment.create({data:assessment})
  }

  async updateAssessment(updatedAssessment,id) {
    await prisma.assessment.update(
      { where: { id: id }, data: updatedAssessment }
    )
  }

  async deleteAssessment(id) {
    await prisma.assessment.delete({ where: { id: id } });
  }

  async generateAssessmentTitle(sectionCRN, type) {
    const count = (await this.countAssessmentsByType(sectionCRN, type)) + 1;
    return type === "project"
      ? `Project Phase ${count}`
      : `${capitalize(type)} ${count}`;
  }

  async getAssessmentSummary(user, semesterId) {
    const assessments = await this.getAssessments(user, semesterId, "all");
    // Group assessments by sectionCRN and type then compute
    // the count and total effort hours
    const summary = assessments.reduce((acc, assessment) => {
      const key = `${assessment.sectionCRN}-${assessment.type}`;

      if (!acc[key]) {
        acc[key] = {
          sectionCRN: assessment.sectionCRN,
          courseName: `${assessment.section.courseCode} - ${assessment.section.courseName}`,
          type: assessment.type,
          count: 0,
          effortHours: 0,
        };
      }

      acc[key].count += 1;
      acc[key].effortHours += assessment.effortHours;
      return acc;
    }, {});

    console.log("Assessment Summary:", Object.values(summary));
    return Object.values(summary);
  }
}

export default new AssessmentRepo();
