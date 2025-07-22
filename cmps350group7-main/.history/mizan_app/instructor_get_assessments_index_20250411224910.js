document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch("../mizan-data/assessments.json" );
        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const assessments = await response.json();
        
        if (!Array.isArray(assessments)) {
            throw new Error("Invalid data format: expected array");
        }

        // Populate course dropdown
        populateCourseDropdown(assessments);
        
        // Display all assessments initially
        displayAssessments(assessments);
        
        // Add event listener for course filter
        document.getElementById("courses").addEventListener("change", function() {
            const selectedCourse = this.value;
            if (selectedCourse) {
                const filtered = assessments.filter(a => a.coursecode === selectedCourse);
                displayAssessments(filtered);
            } else {
                displayAssessments(assessments);
            }
        });

    } catch (error) {
        console.error("Error:", error);
        displayErrorMessage("Failed to load assessments. Please try again later.");
    }
});

function populateCourseDropdown(assessments) {
    const courseSelect = document.getElementById("courses");
    const courses = new Set();
    
    assessments.forEach(assessment => {
        if (assessment.coursecode) {
            courses.add(assessment.coursecode);
        }
    });

    courses.forEach(course => {
        const option = document.createElement("option");
        option.value = course;
        option.textContent = course;
        courseSelect.appendChild(option);
    });
}

function displayAssessments(assessments) {
    const assessmentsList = document.getElementById("upcoming-assessments");
    
    if (!assessmentsList) return;

    assessmentsList.innerHTML = "";

    if (assessments.length === 0) {
        assessmentsList.innerHTML = "<li>No assessments found</li>";
        return;
    }

    assessments.forEach(assessment => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="assessment-header">
                <h3>${assessment.title}</h3>
                <span class="course-code">${assessment.coursecode}</span>
            </div>
            <div class="assessment-details">
                <span><strong>Course:</strong> ${assessment.coursename}</span>
                <span><strong>Due:</strong> ${formatDate(assessment.duedate)}</span>
                <span><strong>Type:</strong> ${assessment.assessmenttype}</span>
                <span><strong>Weight:</strong> ${assessment.weight}</span>
                <span><strong>Effort:</strong> ${assessment.efforthours} hours</span>
            </div>
        `;
        assessmentsList.appendChild(li);
    });
}

function formatDate(dateString) {
    const [day, month, year] = dateString.split("-");
    return new Date(`${month}/${day}/${year}`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function displayErrorMessage(message) {
    const assessmentsList = document.getElementById("upcoming-assessments");
    if (assessmentsList) {
        assessmentsList.innerHTML = `<li class="error">${message}</li>`;
    }
}