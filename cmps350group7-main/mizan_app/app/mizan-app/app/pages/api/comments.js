import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'mizan-data', 'comments.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const comments = JSON.parse(fileData);
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ message: 'Failed to load comments.' });
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const comments = JSON.parse(fileData);

      const newComment = req.body;
      comments.push(newComment);

      fs.writeFileSync(filePath, JSON.stringify(comments, null, 2));
      res.status(201).json({ message: 'Comment added successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add comment.' });
    }
  } 
  
  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
