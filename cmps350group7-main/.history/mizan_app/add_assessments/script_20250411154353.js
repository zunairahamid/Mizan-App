document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Fetch data from JSON files
        const coursesResponse = await fetch("../../mizan-data/courses.json");
        const assessmentsResponse = await fetch("../../mizan-data/assessments.json");
        const typesResponse = await fetch("../../mizan-data/assessment_type.json");
        const deptsResponse = await fetch("../../mizan-data/departments.json");

        // Check if all fetch requests were successful
        if (!coursesResponse.ok) {
            throw new Error(`Failed to fetch courses: ${coursesResponse.status}`);
        }
        if (!assessmentsResponse.ok) {
            throw new Error(`Failed to fetch assessments: ${assessmentsResponse.status}`);
        }
        if (!typesResponse.ok) {
            throw new Error(`Failed to fetch assessment types: ${typesResponse.status}`);
        }
        if (!deptsResponse.ok) {
            throw new Error(`Failed to fetch departments: ${deptsResponse.status}`);
        }

        // Parse JSON data
        const courses = await coursesResponse.json();
        const assessments = await assessmentsResponse.json();
        const types = await typesResponse.json();
        const depts = await deptsResponse.json();

        // Validate courses data
        if (!Array.isArray(courses)) {
            throw new Error("Invalid data format: expected an array for courses");
        }

        // Display course options
        displayCourseIDOption(courses);
        displayCourseNameOption(courses);

        function displayCourseIDOption(courses) {
            const courseSelect = document.getElementById("course");
            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course.coursecode;
                option.textContent = course.coursecode;
                courseSelect.appendChild(option);
            });
        }

        function displayCourseNameOption(courses) {
            const courseNameSelect = document.getElementById("coursename");
            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course.coursename;
                option.textContent = course.coursename;
                courseNameSelect.appendChild(option);
            });
        }

        // Add event listener for the save button
        const buttonSave = document.getElementById("button");
        buttonSave.addEventListener("click", submit);

        function submit(event) {
            event.preventDefault(); // Prevent default form submission behavior

            const courseSelect = document.getElementById("course");
            const selectedCourse = courses.find(c => c.coursecode === courseSelect.value);

            const title = document.getElementById("title").value;
            const dueDate = document.getElementById("due-date").value;
            const [year, month, day] = dueDate.split("-");
            const formattedDate = `${day}-${month}-${year}`;

            const effortHours = document.getElementById("effort-hours").value;
            const weightage = document.getElementById("weight").value;

            const typeSelect = document.getElementById("type");
            const selectedType = types.find(t => t === typeSelect.value);

            const courseNameSelect = document.getElementById("coursename");
            const selectedName = courses.find(c => c.coursename === courseNameSelect.value);

            const courseProgramSelect = document.getElementById("program");
            const selectedProgram = depts.find(d => d === courseProgramSelect.value);

            const newAssessment = {
                title: title,
                coursecode: selectedCourse?.coursecode || "",
                coursename: selectedName?.coursename || "",
                program: selectedProgram || "",
                duedate: formattedDate,
                efforthours: effortHours,
                weight: weightage,
                assessmenttype: selectedType || ""
            };

            // Save the new assessment
            try {
                fetch("../../mizan-data/assessments.json", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newAssessment)
                }).then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to save the assessment");
                    }
                    console.log("Assessment saved successfully");
                });
            } catch (error) {
                console.error("Error saving assessment:", error);
            }
        }
    } catch (error) {
        console.error("Error:", error);
        displayErrorMessage("Failed to load data. Please try again later.");
    }
});

function displayErrorMessage(message) {
    const errorContainer = document.getElementById("error-message");
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = "block";
    }
}

