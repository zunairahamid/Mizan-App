document.addEventListener("DOMContentLoaded", async function() {
    let courses = [];
    
    try {
        // Load courses for the dropdown
        const coursesResponse = await fetch("courses.json");
        if (!coursesResponse.ok) throw new Error('Failed to load courses');
        courses = await coursesResponse.json();
        displayCourseOptions(courses);
        
        // Set up form submission handler
        document.getElementById("assessment-form").addEventListener("submit", async function(e) {
            e.preventDefault();
            await handleFormSubmission(courses);
        });
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to initialize form. Please try again later.");
    }
});

function displayCourseOptions(courses) {
    const courseSelect = document.getElementById("course");
    courseSelect.innerHTML = '<option value="" disabled selected>Select a course</option>';
    
    courses.forEach(course => {
        const option = document.createElement("option");
        option.value = course.coursecode;
        option.textContent = `${course.coursecode} - ${course.coursename}`;
        courseSelect.appendChild(option);
    });
}

async function handleFormSubmission(courses) {
    try {
        // Get form values
        const courseSelect = document.getElementById("course");
        const selectedCourse = courses.find(c => c.coursecode === courseSelect.value);
        
        // Format the date from YYYY-MM-DD to DD-MM-YYYY
        const dueDateInput = document.getElementById("due-date").value;
        const [year, month, day] = dueDateInput.split('-');
        const formattedDate = `${day}-${month}-${year}`;
        
        // Create new assessment object
        const newAssessment = {
            title: document.getElementById("title").value,
            coursecode: selectedCourse.coursecode,
            coursename: selectedCourse.coursename,
            program: selectedCourse.program,
            duedate: formattedDate,
            efforthours: document.getElementById("effort-hours").value,
            weight: document.getElementById("weight").value + "%",
            assessmenttype: document.getElementById("type").value
        };
        
        // Load existing assessments
        const assessmentsResponse = await fetch("assessments.json");
        if (!assessmentsResponse.ok) throw new Error('Failed to load assessments');
        let assessments = await assessmentsResponse.json();
        
        // Add new assessment
        assessments.push(newAssessment);
        
        // In a real application, you would send this to a server endpoint
        // For this demo, we'll simulate saving by logging to console
        console.log("New assessment to be saved:", newAssessment);
        console.log("Updated assessments list:", assessments);
        
        // Show success message
        alert("Assessment saved successfully!");
        document.getElementById("assessment-form").reset();
        
        // Note: In a real application, you would need server-side code to actually
        // write to the JSON file. Client-side JavaScript cannot directly write to files.
        
    } catch (error) {
        console.error("Error saving assessment:", error);
        alert("Failed to save assessment. Please try again.");
    }
}