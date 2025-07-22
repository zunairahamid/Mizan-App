document.addEventListener("DOMContentLoaded", async function() {
    try {
        // Load courses
        const coursesResponse = await fetch("../../mizan-data/courses.json");
        const courses = await coursesResponse.json();
        
        // Load or initialize assessments
        let assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
        
        // Populate course dropdown
        const courseSelect = document.getElementById("course");
        courses.forEach(course => {
            const option = document.createElement("option");
            option.value = course.coursecode;
            option.textContent = `${course.coursecode} - ${course.coursename}`;
            courseSelect.appendChild(option);
        });

        // Form submission
        document.getElementById("assessment-form").addEventListener("submit", function(e) {
            e.preventDefault();
            
            const courseCode = courseSelect.value;
            const selectedCourse = courses.find(c => c.coursecode === courseCode);
            
            const newAssessment = {
                title: document.getElementById("title").value,
                coursecode: courseCode,
                coursename: selectedCourse.coursename,
                program: selectedCourse.program,
                duedate: document.getElementById("due-date").value,
                efforthours: document.getElementById("effort-hours").value,
                weight: document.getElementById("weight").value + "%",
                assessmenttype: document.getElementById("type").value
            };
            
            // Add to assessments and save to localStorage
            assessments.push(newAssessment);
            localStorage.setItem('assessments', JSON.stringify(assessments));
            
            alert("Assessment saved to browser storage!");
            this.reset();
        });
        
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to load data");
    }
});