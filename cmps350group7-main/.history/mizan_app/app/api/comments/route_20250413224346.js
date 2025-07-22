
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'mizan-data', 'comments.json');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');

  const data = JSON.parse(fs.readFileSync(filePath));
  const filtered = data.filter(comment => comment.courseId === courseId);
  return Response.json(filtered);
}

export async function POST(request) {
  const comment = await request.json();
  const data = JSON.parse(fs.readFileSync(filePath));

  comment.id = Date.now().toString();
  data.push(comment);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return Response.json(comment, { status: 201 });
}
