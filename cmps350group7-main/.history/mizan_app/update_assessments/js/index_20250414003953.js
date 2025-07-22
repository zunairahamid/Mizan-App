let assessments = []; // start empty

// Load assessments
async function loadAssessments() {
  const localData = localStorage.getItem("assessments");

  if (localData) {
    assessments = JSON.parse(localData);
  } else {
    try {
      const response = await fetch('../mizan-data/assessments.json');
      assessments = await response.json();
    } catch (error) {
      console.error("Failed to load assessments:", error);
    }
  }
}

loadAssessments(); // Call when page loads

// Update form submit handler
document.getElementById("updateForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const title = document.getElementById("assessmentTitle").value.trim();
    const newDueDate = document.getElementById("newDueDate").value;
    const newEffortHours = document.getElementById("newEffortHours").value;
    
    const assessment = assessments.find(a => a.title.toLowerCase() === title.toLowerCase());
    const result = document.getElementById("result");

    if (assessment) {
        assessment.duedate = newDueDate;  // match your real JSON field name (duedate not dueDate!)
        assessment.efforthours = parseFloat(newEffortHours); // match JSON field name (efforthours)

        // Save updated assessments to localStorage
        localStorage.setItem("assessments", JSON.stringify(assessments));

        result.textContent = "Assessment updated successfully!";
    } else {
        result.textContent = "Assessment not found.";
    }

    document.getElementById("updateForm").reset();
});
