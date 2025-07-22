document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch("../../mizan-data/courses.json" )
        const newresponse=await fetch("../../mizan_data/assessments.json")
        const typeresponse=await fetch("../../mizan_data/assessment_type.json")
        
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }
        if (!newresponse.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }
        if (!typeresponse.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const courses = await response.json();
        const assessments=await newresponse.json();
        const types=await typeresponse.json()
        if (!Array.isArray(courses)) {
            throw new Error("Invalid data format: expected array");
        }
        displayCourseIDOption(courses);
        function displayCourseIDOption(courses){
            const courseSelect = document.getElementById("course")
            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course;
                option.textContent = course.coursecode;
                courseSelect.appendChild(option);
            });
        }
        displayCourseNameOption(courses);
        function displayCourseNameOption(courses){
            const courseSelect = document.getElementById("coursename")
            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course;
                option.textContent = course.coursename;
                courseSelect.appendChild(option);
            });
        }
        displayProgramOption(courses);
        function displayProgramOption(courses){
            const courseSelect = document.getElementById("program")
            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course;
                option.textContent = course.program;
                courseSelect.appendChild(option);
            });
        }
        buttonSave=document.getElementById("button")
        buttonSave.addEventListener(submit())
        function submit(){
            const courseSelect=document.getElementById("course")
            const selectedCourse=courses.find(c=>c.coursecode===courseSelect.value)
            const title=document.getElementById("title").value
            const dueDate=document.getElementById("due-date").value
            const [year,month,day]=dueDate.split('-')
            const date=`${day}-${month}-${year}`
            const effortHours=document.getElementById("effort-hours").value
            const weightage=document.getElementById("weight").value
            const typeSelect=document.getElementById("type")
            const selectedType=types.find(t=>t===selectedType.value)
            const courseName=document.getElementById("coursename")
            const selectedName=courses.find(c=>c.coursename===courseName.value)
            const courseProgram=document.getElementById("program")
            const selectedProgram=courses.find(c=>c.program===courseProgram.value)
            const newAssessment={
                title:title,
                coursecode:selectedCourse,
                coursename:courseName,
                
            }
        }
    } catch (error) {
        console.error("Error:", error);
        displayErrorMessage("Failed to load assessments. Please try again later.");
    }
});

