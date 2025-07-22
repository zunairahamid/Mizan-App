

document.addEventListener("DOMContentLoaded", async function() {
    try {
        const courses=[
            {
                "coursecode":"CMPS350",
                "coursename":"Web Application Development",
                "program":"CS"
                
            },
            {   
                "coursecode":"CMPS185",
                "coursename":"Introduction To Cybersecurity",
                "program":"CS" 
        
            },
            { 
                "coursecode":"CMPS380",
                "coursename":"Fundamentals Of Cybersecurity",
                "program":"CS"
            },
            { 
                "coursecode":"CMPS385",
                "coursename":"Computer Security",
                "program":"CS"
            },
            { 
                "coursecode":"CMPS151",
                "coursename":"Programming Concepts",
                "program":"CS"
            },
            { 
                "coursecode":"CMPS251",
                "coursename":"Object Oriented Programming",
                "program":"CS"
            },
            { 
                "coursecode":"CMPS303",
                "coursename":"Data Structures",
                "program":"CS"
            },
            { 
                "coursecode":"CMPS205",
                "coursename":"Discrete Structures",
                "program":"CS"
            },
            { 
                "coursecode":"CMPS351",
                "coursename":"Fundamentals Of Database",
                "program":"CS"
            },
            { 
                "coursecode":"CMPS200",
                "coursename":"Computer Ethics",
                "program":"CS"
            },
            { 
                "coursecode":"CMPS323",
                "coursename":"Design And Analysis Of Algorithm",
                "program":"CS"
            },
            { 
                "coursecode":"CMPE263",
                "coursename":"Computer Architecture And Organization",
                "program":"CE"
            },
            { 
                "coursecode":"CMPS405",
                "coursename":"Operating Systems",
                "program":"CS"
            },
            { 
                "coursecode":"CMPS312",
                "coursename":"Mobile Application Development",
                "program":"CS"
            },
            { 
                "coursecode":"CMPS360",
                "coursename":"Data Science Fundamentals",
                "program":"CS"
            },
            { 
                "coursecode":"CMPS307",
                "coursename":"Indroduction To Project Management And Entrepreneurship",
                "program":"CS"
            },
            { 
                "coursecode":"CMPS310",
                "coursename":"Software Engineering",
                "program":"CS"
            },
            { 
                "coursecode":"CMPE355",
                "coursename":"Data Communication And Computer Networks",
                "program":"CE"
            }
        ]
        
        // Fetch all data in parallel for better performance
        const [courseResponse, assessmentsResponse, typeResponse, deptResponse] = await Promise.all([
            fetch("../mizan-data/courses.json"),
            fetch("../mizan-data/assessments.json"),
            fetch("../mizan-data/assessment_type.json"),
            fetch("../mizan-data/departments.json")
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