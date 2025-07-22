let assessments = []; 
async function loadAssessments() {
  try {
    const response = await fetch('app/api/assessments'); 
    assessments = await response.json();
  } catch (error) {
    console.error("Failed to fetch assessments:", error);
  }
}

loadAssessments(); 

document.getElementById("deleteForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const title = document.getElementById("assessmentTitle").value.trim();
    const index = assessments.findIndex(a => a.title.toLowerCase() === title.toLowerCase());

    const result = document.getElementById("result");

    if (index !== -1) {
        assessments.splice(index, 1); 

        result.textContent = "Assessment deleted successfully!";
        console.log("Updated Assessments:", assessments); 
    } else {
        result.textContent = "Assessment not found.";
    }

    document.getElementById("deleteForm").reset();
});
