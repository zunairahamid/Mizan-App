document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;
  const errorMsg = document.getElementById("errorMsg");

  try {
    let users=localStorage.getItem("users");

    const matchedUser = users.find(
      user => user.email === email && user.password === password && user.role === role
    );

    if (matchedUser) {
      localStorage.setItem("users", JSON.stringify(user));
      alert("Login successful!");

      if (role === "student") {
        href = "../../get_assessments/student-get-assessments/index.html";
      } else if (role === "instructor") {
       href = "../../get_assessments/instructor-get-assessments/index.html";
      } else {
        href = "../../get_assessments/coordinator-get-assessments/index.html";
      }      
    } else {
      errorMsg.textContent = "Invalid credentials or role. Try again.";
    }
  } catch (error) {
    console.error("Failed to fetch users:", error);
    errorMsg.textContent = "An error occurred. Please try again later.";
  }

});