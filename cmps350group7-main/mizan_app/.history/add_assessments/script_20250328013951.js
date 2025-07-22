document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch("../../mizan-data/courses.json" );
        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const courses = await response.json();
        
        if (!Array.isArray(courses)) {
            throw new Error("Invalid data format: expected array");
        }
        displayCourseOption(courses);
        function displayCourseOption(courses){
            const courseSelect = document.getElementById("course");
            
            

            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course;
                option.textContent = course.coursecode;
                courseSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error:", error);
        displayErrorMessage("Failed to load assessments. Please try again later.");
    }
});

