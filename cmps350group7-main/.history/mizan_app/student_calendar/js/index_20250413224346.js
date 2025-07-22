const calendar = document.getElementById("calendar");
const currentMonthYear = document.getElementById("currentMonthYear");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

let currentDate = new Date();
let assessments = []; 

async function fetchAssessments() {
  try {
    const response = await fetch('/api/assessments');
    assessments = await response.json();
    renderCalendar(); 
  } catch (error) {
    console.error("Failed to load assessments:", error);
  }
}


function renderCalendar() {
  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  currentMonthYear.textContent = `${currentDate.toLocaleString("default", { month: "long" })} ${year}`;

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];

  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(day => {
    const header = document.createElement("div");
    header.className = "day-header";
    header.textContent = day;
    calendar.appendChild(header);
  });

  days.forEach(day => {
    const cell = document.createElement("div");
    cell.className = "day-cell";

    if (day) {
      const dayNumber = document.createElement("span");
      dayNumber.className = "day-number";
      dayNumber.textContent = day;
      cell.appendChild(dayNumber);

      const todayAssessments = getAssessmentTitles(year, month + 1, day);
      if (todayAssessments.length > 0) {
        cell.classList.add("has-assessment");
        todayAssessments.forEach(title => {
          const event = document.createElement("div");
          event.className = "event";
          event.textContent = title;
          cell.appendChild(event);
        });
      }
    }

    calendar.appendChild(cell);
  });
}

function getAssessmentTitles(year, month, day) {
  const dateStr = `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`;
  return assessments.filter(a => a.duedate === dateStr).map(a => a.title);
}


prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

fetchAssessments();
