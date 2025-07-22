const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Data paths
const DATA_DIR = path.join(__dirname, 'data');
const COURSES_FILE = path.join(DATA_DIR, '../../mizan-data/courses.json');
const ASSESSMENTS_FILE = path.join(DATA_DIR, '../../mizan-data/assessments.json');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Initialize data files
function initDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  
  const defaultData = {
    courses: require('./data/default-courses.json'),
    assessments: [],
    comments: [],
    users: [
      { email: "student@uni.edu", password: "123", role: "student" },
      { email: "instructor@uni.edu", password: "123", role: "instructor" },
      { email: "coordinator@uni.edu", password: "123", role: "coordinator" }
    ]
  };

  if (!fs.existsSync(COURSES_FILE)) fs.writeFileSync(COURSES_FILE, JSON.stringify(defaultData.courses));
  if (!fs.existsSync(ASSESSMENTS_FILE)) fs.writeFileSync(ASSESSMENTS_FILE, JSON.stringify(defaultData.assessments));
  if (!fs.existsSync(COMMENTS_FILE)) fs.writeFileSync(COMMENTS_FILE, JSON.stringify(defaultData.comments));
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify(defaultData.users));
}

// API Endpoints

// Authentication
app.post('/api/login', (req, res) => {
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const user = users.find(u => u.email === req.body.email && u.password === req.body.password);
  
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Courses
app.get('/api/courses', (req, res) => {
  const courses = JSON.parse(fs.readFileSync(COURSES_FILE));
  res.json(courses);
});

// Assessments
app.get('/api/assessments', (req, res) => {
  const assessments = JSON.parse(fs.readFileSync(ASSESSMENTS_FILE));
  res.json(assessments);
});

app.post('/api/assessments', (req, res) => {
  const assessments = JSON.parse(fs.readFileSync(ASSESSMENTS_FILE));
  const newAssessment = {
    id: `asmt-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  assessments.push(newAssessment);
  fs.writeFileSync(ASSESSMENTS_FILE, JSON.stringify(assessments));
  res.status(201).json(newAssessment);
});

// Comments
app.get('/api/comments', (req, res) => {
  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE));
  res.json(comments);
});

app.post('/api/comments', (req, res) => {
  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE));
  const newComment = {
    id: `cmt-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  comments.push(newComment);
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments));
  res.status(201).json(newComment);
});

// Initialize and start server
initDataFiles();
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));