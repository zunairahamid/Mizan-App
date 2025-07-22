import courses from '../../mizan-data/courses.json';

document.addEventListener("DOMContentLoaded", async function() {
    try {
        console.log(courses);
        
        // Fetch all data in parallel for better performance
        const [assessmentsResponse, typeResponse, deptResponse] = await Promise.all([
            fetch("../../mizan-data/assessments.json"),
            fetch("../../mizan-data/assessment_type.json"),
            fetch("../../mizan-data/departments.json")
        ]);

        // Check all responses
        if (!assessmentsResponse.ok || !typeResponse.ok || !deptResponse.ok) {
            throw new Error(`Failed to fetch data: ${assessmentsResponse.status}`);
        }

        // Parse all JSON data
        const [assessments, types, depts] = await Promise.all([
            assessmentsResponse.json(),
            typeResponse.json(),
            deptResponse.json()
        ]);

        if (!Array.isArray(courses)) {
            throw new Error("Invalid data format: expected array");
        }

        // Initialize UI components
        displayCourseIDOption(courses);
        displayCourseNameOption(courses);

        // Set up form submission
        const buttonSave = document.getElementById("button");
        buttonSave.addEventListener("click", handleSubmit);

        function displayCourseIDOption(courses) {
            const courseSelect = document.getElementById("course");
            courseSelect.innerHTML = ''; // Clear existing options
            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course.coursecode; // Store just the code as value
                option.textContent = course.coursecode;
                courseSelect.appendChild(option);
            });
        }

        function displayCourseNameOption(courses) {
            const courseSelect = document.getElementById("coursename");
            courseSelect.innerHTML = ''; // Clear existing options
            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course.coursename; // Store just the name as value
                option.textContent = course.coursename;
                courseSelect.appendChild(option);
            });
        }

        async function handleSubmit(event) {
            event.preventDefault(); // Prevent default form submission
            
            try {
                const courseSelect = document.getElementById("course");
                const title = document.getElementById("title").value;
                const dueDate = document.getElementById("due-date").value;
                const [year, month, day] = dueDate.split('-');
                const date = `${day}-${month}-${year}`;
                const effortHours = document.getElementById("effort-hours").value;
                const weightage = document.getElementById("weight").value;
                const typeSelect = document.getElementById("type");
                const courseNameSelect = document.getElementById("coursename");
                const programSelect = document.getElementById("program");

                // Find selected items
                const selectedCourse = courses.find(c => c.coursecode === courseSelect.value);
                const selectedType = types.find(t => t.id === typeSelect.value);
                const selectedProgram = depts.find(d => d.id === programSelect.value);

                if (!selectedCourse || !selectedType || !selectedProgram) {
                    throw new Error("Invalid selection");
                }

                const newAssessment = {
                    title: title,
                    coursecode: selectedCourse.coursecode,
                    coursename: selectedCourse.coursename,
                    program: selectedProgram.name,
                    duedate: date,
                    efforthours: effortHours,
                    weight: weightage,
                    assessmenttype: selectedType.name
                };

                // Send data to server
                const response = await fetch("../../mizan-data/assessments.json", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newAssessment)
                });

                if (!response.ok) {
                    throw new Error('Failed to save assessment');
                }

                console.log("Assessment saved successfully");
                alert("Assessment saved successfully!");
                
            } catch (error) {
                console.error("Submission error:", error);
                alert("Failed to save assessment. Please try again.");
            }
        }

    } catch (error) {
        console.error("Initialization error:", error);
        displayErrorMessage("Failed to load data. Please try again later.");
    }
});

function displayErrorMessage(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    document.body.prepend(errorDiv);
}