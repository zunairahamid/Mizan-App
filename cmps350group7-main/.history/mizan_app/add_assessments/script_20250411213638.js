document.addEventListener("DOMContentLoaded", async function() {
    try {
        // Courses data (should ideally come from an API)
        const courses = [
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

        // Populate course code dropdown
        const courseSelect = document.getElementById("course");
        courses.forEach(course => {
            const option = document.createElement("option");
            option.value = course.coursecode;
            option.textContent = course.coursecode;
            courseSelect.appendChild(option);
        });

        // Populate course name dropdown
        const courseNameSelect = document.getElementById("coursename");
        courses.forEach(course => {
            const option = document.createElement("option");
            option.value = course.coursename;
            option.textContent = course.coursename;
            courseNameSelect.appendChild(option);
        });

        // Populate program dropdown
        const programSelect = document.getElementById("program");
        depts.forEach(dept => {
            const option = document.createElement("option");
            option.value = dept;
            option.textContent = dept;
            programSelect.appendChild(option);
        });

        // Populate assessment type dropdown
        const typeSelect = document.getElementById("type");
        types.forEach(type => {
            const option = document.createElement("option");
            option.value = type;
            option.textContent = type;
            typeSelect.appendChild(option);
        });

        // Handle form submission
        const form = document.getElementById("assessment-form");
        form.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            try {
                const selectedCourseCode = document.getElementById("course").value;
                const selectedCourse = courses.find(c => c.coursecode === selectedCourseCode);
                
                const newAssessment = {
                    title: document.getElementById("title").value,
                    coursecode: selectedCourse.coursecode,
                    coursename: selectedCourse.coursename,
                    program: document.getElementById("program").value,
                    duedate: document.getElementById("due-date").value,
                    efforthours: document.getElementById("effort-hours").value,
                    weight: document.getElementById("weight").value,
                    assessmenttype: document.getElementById("type").value
                };

                // Format date from YYYY-MM-DD to DD-MM-YYYY
                const [year, month, day] = newAssessment.duedate.split('-');
                newAssessment.duedate = `${day}-${month}-${year}`;

                // Save to server (using your Node.js backend)
                const response = await fetch('http://localhost:3000/api/assessments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newAssessment)
                });

                if (!response.ok) {
                    throw new Error('Failed to save assessment');
                }

                alert('Assessment saved successfully!');
                form.reset();
                
            } catch (error) {
                console.error("Save error:", error);
                alert('Failed to save assessment. Please try again.');
            }
        });

    } catch (error) {
        console.error("Initialization error:", error);
        alert('Failed to load page data. Please try again later.');
    }
});