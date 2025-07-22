import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'mizan-data', 'assessments.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Load assessments
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const assessments = JSON.parse(fileData);
      res.status(200).json(assessments);
    } catch (error) {
      res.status(500).json({ message: 'Failed to load assessments.' });
    }
  } 
  
  else if (req.method === 'DELETE') {
    // Delete assessment
    try {
      const { title } = req.body;
      let assessments = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      assessments = assessments.filter(a => a.title !== title);

      fs.writeFileSync(filePath, JSON.stringify(assessments, null, 2));
      res.status(200).json({ message: 'Assessment deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete assessment.' });
    }
  } 
  
  else if (req.method === 'PUT') {
    // Update assessment
    try {
      const { title, newDueDate, newEffortHours } = req.body;
      let assessments = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      const assessment = assessments.find(a => a.title === title);

      if (assessment) {
        assessment.duedate = newDueDate;
        assessment.efforthours = newEffortHours;
        fs.writeFileSync(filePath, JSON.stringify(assessments, null, 2));
        res.status(200).json({ message: 'Assessment updated successfully.' });
      } else {
        res.status(404).json({ message: 'Assessment not found.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to update assessment.' });
    }
  } 
  
  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
