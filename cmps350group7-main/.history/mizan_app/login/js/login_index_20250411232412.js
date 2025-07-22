document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;
    const errorMsg = document.getElementById("errorMsg");
  
    const users = [
      { email: "1@example.com", password: "123", role: "student" },
      { email: "2@example.com", password: "456", role: "instructor" },
      { email: "3@example.com", password: "789", role: "coordinator" }
    ];
  
    const matchedUser = users.find(
      user => user.email === email && user.password === password && user.role === role
    );
  
    if (matchedUser) {
      localStorage.setItem("user", JSON.stringify(matchedUser));
      alert("Login successful!");
      if (role === "student") {
        window.location.href = "../../../get_assessments/student-get-assessments/index.html";
      } else if (role === "instructor") {
        window.location.href = "../../../get_assessments/instructor-get-assessments/index.html";
      } else {
        window.location.href = "../../../get_assessments/student-get-assessments/index.html";
      }
    } else {
      errorMsg.textContent = "Invalid credentials or role. Try again.";
    }
  });
  