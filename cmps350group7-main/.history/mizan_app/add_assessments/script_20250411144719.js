document.addEventListener("DOMContentLoaded", async function() {
    try {
        // 1. Fix file paths - use forward slashes and proper relative paths
        const basePath = "../../mizan-data/";
        const [coursesResponse, assessmentsResponse, typesResponse, deptsResponse] = await Promise.all([
            fetch("D:\CMPS350\projects\cmps350group7\mizan_app\mizan-data\courses.json"),
            fetch(`${basePath}assessments.json`),  // Note: Fix typo in filename if needed (assessments vs assessments)
            fetch(`${basePath}assessment_type.json`),
            fetch(`${basePath}departments.json`)   // Note: Fix typo in filename if needed (departments vs departments)
        ]);

        // 2. Check all responses
        if (!coursesResponse.ok) throw new Error(`Failed to fetch courses: ${coursesResponse.status}`);
        if (!assessmentsResponse.ok) throw new Error(`Failed to fetch assessments: ${assessmentsResponse.status}`);
        if (!typesResponse.ok) throw new Error(`Failed to fetch assessment types: ${typesResponse.status}`);
        if (!deptsResponse.ok) throw new Error(`Failed to fetch departments: ${deptsResponse.status}`);

        // 3. Parse all JSON data
        const [courses, assessments, types, depts] = await Promise.all([
            coursesResponse.json(),
            assessmentsResponse.json(),
            typesResponse.json(),
            deptsResponse.json()
        ]);

        // 4. Validate data
        if (!Array.isArray(courses)) throw new Error("Courses data is not an array");
        if (!Array.isArray(types)) throw new Error("Assessment types data is not an array");
        if (!Array.isArray(depts)) throw new Error("Departments data is not an array");

        // 5. Populate dropdowns
        populateDropdown("course", courses, "coursecode");
        populateDropdown("coursename", courses, "coursename");
        populateDropdown("type", types);
        populateDropdown("program", depts);

        // 6. Setup form submission
        const form = document.getElementById("assessment-form"); // Add this ID to your form
        if (form) {
            form.addEventListener("submit", async function(e) {
                e.preventDefault();
                await saveAssessment(courses, types, depts, assessments);
            });
        }

    } catch (error) {
        console.error("Error:", error);
        displayErrorMessage(`Failed to load data: ${error.message}`);
    }
});

// Helper function to populate dropdowns
function populateDropdown(elementId, data, propertyName = null) {
    const select = document.getElementById(elementId);
    if (!select) {
        console.error(`Element with ID ${elementId} not found`);
        return;
    }

    // Clear existing options
    select.innerHTML = '';
    
    // Add default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = `-- Select ${elementId} --`;
    select.appendChild(defaultOption);

    // Add data options
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
        const formData = {
            courseCode: document.getElementById("course").value,
            courseName: document.getElementById("coursename").value,
            title: document.getElementById("title").value,
            dueDate: document.getElementById("due-date").value,
            effortHours: document.getElementById("effort-hours").value,
            weight: document.getElementById("weight").value,
            type: document.getElementById("type").value,
            program: document.getElementById("program").value
        };

        // Validate form data
        if (!formData.courseCode || !formData.title || !formData.dueDate) {
            throw new Error("Please fill in all required fields");
        }

        // Format date
        const [year, month, day] = formData.dueDate.split('-');
        const formattedDate = `${day}-${month}-${year}`;

        // Create new assessment object
        const newAssessment = {
            title: formData.title,
            coursecode: formData.courseCode,
            coursename: formData.courseName,
            program: formData.program,
            duedate: formattedDate,
            efforthours: parseFloat(formData.effortHours) || 0,
            weight: parseFloat(formData.weight) || 0,
            assessmenttype: formData.type
        };

        // Add to existing assessments
        const updatedAssessments = [...existingAssessments, newAssessment];

        // Save to server
        const response = await fetch("../../mizan-data/assessments.json", {
            method: "PUT", // or "POST" depending on your server setup
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedAssessments)
        });

        if (!response.ok) {
            throw new Error(`Failed to save: ${response.status}`);
        }

        alert("Assessment saved successfully!");
        form.reset();

    } catch (error) {
        console.error("Save error:", error);
        displayErrorMessage(`Failed to save assessment: ${error.message}`);
    }
}

function displayErrorMessage(message) {
    const errorElement = document.getElementById("error-message");
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
    } else {
        alert(message); // Fallback if error element doesn't exist
    }
}