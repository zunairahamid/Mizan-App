document.addEventListener("DOMContentLoaded", async function() {
    try {
        // Fetch all data in parallel for better performance
        const [coursesResponse, assessmentsResponse, typesResponse, deptsResponse] = await Promise.all([
            fetch("../../mizan-data/courses.json"),
            fetch("../../mizan-data/assessments.json"),
            fetch("../../mizan-data/assessment_type.json"),
            fetch("../../mizan-data/departments.json")
        ]);

        // Check all responses
        if (!coursesResponse.ok || !assessmentsResponse.ok || !typesResponse.ok || !deptsResponse.ok) {
            throw new Error('Failed to fetch one or more data files');
        }

        // Parse all JSON data
        const [courses, assessments, types, depts] = await Promise.all([
            coursesResponse.json(),
            assessmentsResponse.json(),
            typesResponse.json(),
            deptsResponse.json()
        ]);

        if (!Array.isArray(courses)) {
            throw new Error("Invalid data format: expected array for courses");
        }

        // Populate dropdowns
        populateDropdown("course", courses, "coursecode");
        populateDropdown("coursename", courses, "coursename");
        populateDropdown("type", types);
        populateDropdown("program", depts);

        // Set up form submission
        const form = document.getElementById("assessment-form"); // Assuming you have a form with this ID
        form.addEventListener("submit", async function(e) {
            e.preventDefault();
            await saveAssessment(courses, types, depts, assessments);
        });

    } catch (error) {
        console.error("Error:", error);
        displayErrorMessage("Failed to load data. Please try again later.");
    }
});

// Helper function to populate dropdowns
function populateDropdown(elementId, data, propertyName = null) {
    const select = document.getElementById(elementId);
    if (!select) return;

    select.innerHTML = ''; // Clear existing options
    
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = propertyName ? item[propertyName] : item;
        option.textContent = propertyName ? item[propertyName] : item;
        select.appendChild(option);
    });
}

async function saveAssessment(courses, types, depts, existingAssessments) {
    try {
        // Get form values
        const courseSelect = document.getElementById("course");
        const selectedCourse = courses.find(c => c.coursecode === courseSelect.value);
        
        const title = document.getElementById("title").value;
        const dueDate = document.getElementById("due-date").value;
        const [year, month, day] = dueDate.split('-');
        const formattedDate = `${day}-${month}-${year}`;
        
        const effortHours = parseFloat(document.getElementById("effort-hours").value);
        const weightage = parseFloat(document.getElementById("weight").value);
        
        const typeSelect = document.getElementById("type");
        const selectedType = typeSelect.value;
        
        const courseNameSelect = document.getElementById("coursename");
        const selectedName = courseNameSelect.value;
        
        const courseProgram = document.getElementById("program").value;

        // Validate inputs
        if (!title || !selectedCourse || !formattedDate || isNaN(effortHours) || isNaN(weightage)) {
            throw new Error('Please fill in all required fields with valid values');
        }

        // Create new assessment object
        const newAssessment = {
            title: title,
            coursecode: selectedCourse.coursecode,
            coursename: selectedName,
            program: courseProgram,
            duedate: formattedDate,
            efforthours: effortHours,
            weight: weightage,
            assessmenttype: selectedType
        };

        // Add to existing assessments and save
        const updatedAssessments = [...existingAssessments, newAssessment];
        
        const response = await fetch("../../mizan-data/assessments.json", {
            method: "PUT", // or "POST" depending on your server setup
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedAssessments)
        });

        if (!response.ok) {
            throw new Error('Failed to save assessment');
        }

        alert('Assessment saved successfully!');
        form.reset(); // Reset the form

    } catch (error) {
        console.error("Error saving assessment:", error);
        displayErrorMessage("Failed to save assessment. Please try again.");
    }
}

function displayErrorMessage(message) {
    // Implement your error display logic here
    const errorElement = document.getElementById("error-message"); // Assuming you have an element with this ID
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
    }
}