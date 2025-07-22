
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'mizan_app','mizan-data', 'assessment_type.json');

export async function GET() {
  const data = JSON.parse(fs.readFileSync(filePath));
  return Response.json(data);
}

export async function POST(request) {
  const newItem = await request.json();
  const data = JSON.parse(fs.readFileSync(filePath));
  newItem.id = Date.now().toString();
  data.push(newItem);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return Response.json(newItem, { status: 201 });
}
