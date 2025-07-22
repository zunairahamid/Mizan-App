import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs-extra";

const prisma = new PrismaClient();
const basePath = path.join(process.cwd(), "data");

async function main() {
  console.log("🧹 Clearing all tables...");
  await prisma.comment.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.section.deleteMany();
  await prisma.user.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.assessmentType.deleteMany();

  try {
    console.log("seeding data...");
    await seedAssessmentTypes();
    await seedSemesters();
    await seedSections();
    await seedNonStudentUsers();
    await seedStudents();
    await seedAssessments();
    await seedComments();
    console.log("All data seeded successfully.");
  } catch (e) {
    console.error("Seeding failed:", e);
    throw e;
  } finally {
    await prisma.$disconnect();
  }
}

async function seedAssessmentTypes() {
  const data = await fs.readJSON(path.join(basePath, "assessment-types.json"));
  for (const type of data) {
    await prisma.assessmentType.create({ data: type });
  }
}

async function seedSemesters() {
  const data = await fs.readJSON(path.join(basePath, "semesters.json"));
  for (const semester of data) {
    await prisma.semester.create({ data: semester });
  }
}

async function seedSections() {
  const data = await fs.readJSON(path.join(basePath, "sections.json"));
  for (const section of data) {
    await prisma.section.create({ data: section });
  }
}

async function seedNonStudentUsers() {
  const data = await fs.readJSON(path.join(basePath, "users.json"));
  const nonStudents = data.filter((user) => user.role !== "Student");
  for (const user of nonStudents) {
    delete user.registeredSections;
    await prisma.user.create({ data: user });
  }
}

async function seedStudents() {
  const data = await fs.readJSON(path.join(basePath, "users.json"));
  const students = data.filter((user) => user.role === "Student");
  for (const student of students) {
    const { registeredSections, ...userData } = student;
    await prisma.user.create({
      data: {
        ...userData,
        registeredSections: {
          connect: registeredSections.map((crn) => ({ crn })),
        },
      },
    });
  }
}

async function seedAssessments() {
  const data = await fs.readJSON(path.join(basePath, "assessments.json"));

  for (const raw of data) {
    const {
      id,
      section,
      creator,
      sectionCRN,
      createdBy = 3, 
      title,
      type,
      dueDate,
      effortHours,
      weight
    } = raw;

    await prisma.assessment.create({
      data: {
        sectionCRN,
        createdBy,
        title,
        type,
        dueDate: new Date(dueDate),
        effortHours,
        weight,
      },
    });
  }
}


async function seedComments() {
  const data = await fs.readJSON(path.join(basePath, "comments.json"));

  for (const raw of data) {
    const {
      id,
      sectionCRN,
      authorId,
      title,
      createdDate,
      ...rest
    } = raw;

    await prisma.comment.create({
      data: {
        id,
        sectionCRN,
        authorId,
        title,
        createdAt: new Date(createdDate),
        ...rest,
      },
    });
  }
}



await main();
