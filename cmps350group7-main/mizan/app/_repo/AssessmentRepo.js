import fs from "fs-extra";
import path from "path";
import prisma from "@/lib/prisma";
import sectionRepo from "@/app/_repo/SectionRepo";
import { capitalize } from "@/app/actions/utils";

class AssessmentRepo {
  async getAssessmentTypes() {
    return await prisma.assessmentType.findMany();
  }

  constructor() {
    this.assessmentFilePath = path.join(process.cwd(), "data/assessments.json");
  }

  async #readAssessments() {
    return await prisma.assessment.findMany();
  }

  async #writeAssessments(assessment) {
    return prisma.assessment.create({ data: assessment });
  }

  async getAssessmentById(id) {
    return prisma.assessment.findUnique({ where: { id: id } });
  }

  async getAssessmentsBySection(sectionCRN) {
    return prisma.assessment.findMany({ where: { sectionCRN: sectionCRN } });
  }

  async countAssessmentsByType(sectionCRN, type) {
    const assessments = await prisma.assessment.findMany({
      where: {
        sectionCRN: sectionCRN,
        type: type,
      },
    });
    return assessments.length;
  }

  async countAssessmentsByDueDate(sectionCRN, dueDate) {
    const assessments = await prisma.assessment.findMany({
      where: {
        sectionCRN: sectionCRN,
        dueDate: dueDate,
      },
    });
    return assessments.length;
  }

  async #getUserAssessments(user, semesterId) {
    const userSections = await sectionRepo.getSections(user, semesterId);
    const sectionCRNs = userSections.map((section) => section.crn);
    return prisma.assessment.findMany({
      where: {
        sectionCRN: {
          in: sectionCRNs,
        },
      },
    });
  }

  async getAssessments(user, semesterId, sectionCRN) {
    if (!user && (!sectionCRN || sectionCRN === "all")) return [];

    let assessments = await (sectionCRN && sectionCRN !== "all"
      ? this.getAssessmentsBySection(sectionCRN)
      : this.#getUserAssessments(user, semesterId));

    if (!assessments) return [];

    assessments.sort((a, b) => a.sectionCRN.localeCompare(b.sectionCRN));

    for (const assessment of assessments) {
      assessment.section = await sectionRepo.getSectionById(assessment.sectionCRN);
    }

    return assessments;
  }

  

  async addAssessment(assessment) {             //updated!!!
    return await prisma.assessment.create({
      data: {
        title: assessment.title,
        type: assessment.type,
        dueDate: assessment.dueDate,
        effortHours: assessment.effortHours,
        weight: assessment.weight,
        createdDate: new Date(),

        section: {
          connect: { crn: assessment.sectionCRN },
        },

        creator: {
          connect: { id: assessment.createdBy },
        },
      },
    });
  }



  async updateAssessment(updatedAssessment, id) {
    await prisma.assessment.update({
      where: { id: id },
      data: updatedAssessment,
    });
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
    if (!assessments) return [];

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

    return Object.values(summary);
  }
}

export default new AssessmentRepo();