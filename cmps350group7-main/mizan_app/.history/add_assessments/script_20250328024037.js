document.addEventListener("DOMContentLoaded", async function() {
    try {
        // Fetch all required data
        const response = await fetch("../../mizan-data/courses.json");
        const assessmentsResponse = await fetch("../../mizan-data/assessments.json");
        const typeResponse = await fetch("../../mizan-data/assessment_type.json");
        const deptResponse = await fetch("../../mizan-data/departments.json");
        
        if (!response.ok || !assessmentsResponse.ok || !typeResponse.ok || !deptResponse.ok) {
            throw new Error("Failed to fetch data");
        }
        
        const courses = await response.json();
        const assessments = await assessmentsResponse.json();
        const types = await typeResponse.json();
        const departments = await deptResponse.json();
        
        if (!Array.isArray(courses)) {
            throw new Error("Invalid data format: expected array");
        }

        // Populate course dropdown (combine code and name for better UX)
        const courseSelect = document.getElementById("course");
        courses.forEach(course => {
            const option = document.createElement("option");
            option.value = course.coursecode;
            option.textContent = `${course.coursecode} - ${course.coursename}`;
            courseSelect.appendChild(option);
        });

        // Handle form submission
        const form = document.getElementById("assessment-form");
        form.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            // Get form values
            const courseCode = document.getElementById("course").value;
            const selectedCourse = courses.find(c => c.coursecode === courseCode);
            
            const newAssessment = {
                title: document.getElementById("title").value,
                coursecode: courseCode,
                coursename: selectedCourse.coursename,
                program: selectedCourse.program,
                duedate: document.getElementById("due-date").value, // Keep ISO format
                efforthours: document.getElementById("effort-hours").value,
                weight: document.getElementById("weight").value + "%",
                assessmenttype: document.getElementById("type").value
            };
            
            // Add to local array
            assessments.push(newAssessment);
            
            // Save to server (requires backend endpoint)
            try {
                const saveResponse = await fetch("../../mizan-data/assessments.json", {
                    method: "POST", // or "PUT" depending on your backend
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(assessments)
                });
                
                if (!saveResponse.ok) {
                    throw new Error("Failed to save assessment");
                }
                
                alert("Assessment saved successfully!");
                form.reset();
            } catch (error) {
                console.error("Save error:", error);
                alert("Failed to save assessment. Please try again.");
            }
        });
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to load data. Please try again later.");
    }
});