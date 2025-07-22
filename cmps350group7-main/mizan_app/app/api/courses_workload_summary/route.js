
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'mizan_app','app','mizan-data', 'assessments.json');

export async function GET() {
  const data = JSON.parse(fs.readFileSync(filePath));
  
  const summary = {};
  data.forEach(a => {
    if (a && a.coursecode && !summary[a.coursecode]) {
      summary[a.coursecode] = {
        coursecode: a.coursecode,
        course: a.coursename,
        totalEffort: 0,
        totalWeight: 0,
        count: 0
      };
    }
    summary[a.coursecode].totalEffort += Number(a.efforthours || 0);
    summary[a.coursecode].totalWeight += Number(a.weight || 0);
    summary[a.coursecode].count += 1;
  });

  return Response.json(Object.values(summary));
}
