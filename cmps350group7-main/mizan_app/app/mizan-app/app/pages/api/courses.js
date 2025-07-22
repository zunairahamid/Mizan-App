import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'mizan-data', 'courses.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const courses = JSON.parse(fileData);
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to load courses.' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
