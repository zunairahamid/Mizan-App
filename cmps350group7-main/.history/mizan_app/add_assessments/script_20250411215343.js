document.addEventListener("DOMContentLoaded", async function() {
    try {
        // Courses data (should ideally come from an API)
        const courses = [
            {
                "coursecode": "CMPS350",
                "coursename": "Web Application Development",
                "program": "CS"
            },
            {   
                "coursecode": "CMPS185",
                "coursename": "Introduction To Cybersecurity",
                "program": "CS" 
            },
            { 
                "coursecode": "CMPS380",
                "coursename": "Fundamentals Of Cybersecurity",
                "program": "CS"
            },
            { 
                "coursecode": "CMPS385",
                "coursename": "Computer Security",
                "program": "CS"
            },
            { 
                "coursecode": "CMPS151",
                "coursename": "Programming Concepts",
                "program": "CS"
            },
            { 
                "coursecode": "CMPS251",
                "coursename": "Object Oriented Programming",
                "program": "CS"
            },
            { 
                "coursecode": "CMPS303",
                "coursename": "Data Structures",
                "program": "CS"
            },
            { 
                "coursecode": "CMPS205",
                "coursename": "Discrete Structures",
                "program": "CS"
            },
            { 
                "coursecode": "CMPS351",
                "coursename": "Fundamentals Of Database",
                "program": "CS"
            },
            { 
                "coursecode": "CMPS200",
                "coursename": "Computer Ethics",
                "program": "CS"
            },
            { 
                "coursecode": "CMPS323",
                "coursename": "Design And Analysis Of Algorithm",
                "program": "CS"
            },
            { 
                "coursecode": "CMPE263",
                "coursename": "Computer Architecture And Organization",
                "program": "CE"
            },
            { 
                "coursecode": "CMPS405",
                "coursename": "Operating Systems",
                "program": "CS"
            },
            { 
                "coursecode": "CMPS312",
                "coursename": "Mobile Application Development",
                "program": "CS"
            },
            { 
                "coursecode": "CMPS360",
                "coursename": "Data Science Fundamentals",
                "program": "CS"
            },
            { 
                "coursecode": "CMPS307",
                "coursename": "Introduction To Project Management And Entrepreneurship",
                "program": "CS"
            },
            { 
                "coursecode": "CMPS310",
                "coursename": "Software Engineering",
                "program": "CS"
            },
            { 
                "coursecode": "CMPE355",
                "coursename": "Data Communication And Computer Networks",
                "program": "CE"
            }
        ];

        // Fetch data from JSON files
        const [assessmentsResponse, typesResponse, deptsResponse] = await Promise.all([
            fetch("../../mizan-data/assessments.json"),
            fetch("../../mizan-data/assessment_type.json"),
            fetch("../../mizan-data/departments.json")
        ]);

        if (!assessmentsResponse.ok || !typesResponse.ok || !deptsResponse.ok) {
            throw new Error('Failed to fetch one or more data files');
        }

        const [assessments, types, depts] = await Promise.all([
            assessmentsResponse.json(),
            typesResponse.json(),
            deptsResponse.json()
        ]);

        // Get DOM elements
        const courseSelect = document.getElementById("course");
        const courseNameSelect = document.getElementById("coursename");
        const programSelect = document.getElementById("program");
        const typeSelect = document.getElementById("type");
        const form = document.getElementById("assessment-form");

        if (!courseSelect || !courseNameSelect || !programSelect || !typeSelect || !form) {
            throw new Error('Required form elements not found');
        }

        // Populate dropdowns
        function populateDropdown(selectElement, data, valueKey, textKey) {
            selectElement.innerHTML = ''; // Clear existing options
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "-- Select --";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            selectElement.appendChild(defaultOption);
            
            data.forEach(item => {
                const option = document.createElement("option");
                option.value = valueKey ? item[valueKey] : item;
                option.textContent = textKey ? item[textKey] : item;
                selectElement.appendChild(option);
            });
        }

        // Populate course code dropdown
        populateDropdown(courseSelect, courses, "coursecode", "coursecode");
        
        // Populate course name dropdown
        populateDropdown(courseNameSelect, courses, "coursename", "coursename");
        
        // Populate program dropdown
        populateDropdown(programSelect, depts);
        
        // Populate assessment type dropdown
        populateDropdown(typeSelect, types);

        // Link course selection to auto-fill other fields
        courseSelect.addEventListener("change", function() {
            const selectedCourse = courses.find(c => c.coursecode === this.value);
            if (selectedCourse) {
                document.getElementById("coursename").value = selectedCourse.coursename;
                document.getElementById("program").value = selectedCourse.program;
            }
        });

        // Handle form submission
        form.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            try {
                // Form validation
                const title = document.getElementById("title").value.trim();
                const courseCode = document.getElementById("course").value;
                const dueDate = document.getElementById("due-date").value;
                const effortHours = document.getElementById("effort-hours").value;
                const weight = document.getElementById("weight").value;
                
                if (!title || !courseCode || !dueDate || !effortHours || !weight) {
                    throw new Error('Please fill in all required fields');
                }

                const selectedCourse = courses.find(c => c.coursecode === courseCode);
                if (!selectedCourse) {
                    throw new Error('Invalid course selected');
                }

                const newAssessment = {
                    title: title,
                    coursecode: selectedCourse.coursecode,
                    coursename: selectedCourse.coursename,
                    program: document.getElementById("program").value,
                    duedate: document.getElementById("due-date").value,
                    efforthours: parseFloat(effortHours),
                    weight: parseFloat(weight),
                    assessmenttype: document.getElementById("type").value
                };

                // Validate numerical values
                if (isNaN(newAssessment.efforthours) || isNaN(newAssessment.weight)) {
                    throw new Error('Effort hours and weight must be numbers');
                }

                // Format date from YYYY-MM-DD to DD-MM-YYYY
                const [year, month, day] = newAssessment.duedate.split('-');
                newAssessment.duedate = `${day}-${month}-${year}`;

                // Save to server
                const response = await fetch('http://localhost:3000/api/assessments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newAssessment)
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Failed to save assessment');
                }

                alert('Assessment saved successfully!');
                form.reset();
                
            } catch (error) {
                console.error("Save error:", error);
                alert(`Error: ${error.message}`);
            }
        });

    } catch (error) {
        console.error("Initialization error:", error);
        alert(`Error: ${error.message}`);
    }
});