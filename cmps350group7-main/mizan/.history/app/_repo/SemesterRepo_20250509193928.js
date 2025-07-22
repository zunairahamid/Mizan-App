import fs from "fs-extra";
import path from "path";

// Define path to semesters data file
const semesterFilePath = path.join(process.cwd(), "data/semesters.json");

export async function getSemesters() {
  return await prisma.semester.findMany({});
}

export async function getDefaultSemesterId() {
  const semesters= await prisma.semester.findUnique({
    where:(isDefault)
  });
  if(semesters){
    return semesters.id;
  }
}
