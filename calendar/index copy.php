<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Calendar Clean Design</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html,
    body {
      height: 100%;
      font-family: 'Segoe UI', sans-serif;
      background: #ffffffff;
    }

    .wrapper {
      height: 100%;
      padding: 90px;
    }

    .container {
      height: 100%;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.18);
      background: radial-gradient(circle, #a7d3ffff 0%, #74b0ffff 100%);
      display: flex;
      flex-direction: column;
      padding: 1rem;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      margin-bottom: 0.5rem;
    }

    .header-center {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .month-label,
    .year-label {
      font-size: 2rem;
      font-weight: bold;
      color: #ffffffff;
      cursor: pointer;
      user-select: none;
    }

    .nav-arrow {
      font-size: 4rem;
      font-weight: bold;
      color: #ffffffff;
      cursor: pointer;
      user-select: none;
      padding: 0 0.5rem;
      transition: color 0.2s;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.5rem;
      flex-grow: 1;
      overflow-y: auto;
    }

    .day-name,
    .day {
      text-align: center;
      padding: 0.4rem 0;
      background: rgba(255, 255, 255, 0.66);
      border-radius: 10px;
      font-size: 0.85rem;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      color: black;
    }

    .day-name {
      font-weight: bold;
      background: #0300a3ff;
      color: white;
      font-size: 0.75rem;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border-radius: 6px;
      padding: 0;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.3);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 999;
    }

    .modal-content {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      max-width: 400px;
      width: 90%;
    }

    .modal h3 {
      margin-bottom: 1rem;
      text-align: center;
    }

    .month-grid,
    .year-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }

    .month-option,
    .year-option {
      padding: 0.4rem;
      background: #e3efff;
      border-radius: 8px;
      cursor: pointer;
      text-align: center;
      font-size: 0.9rem;
    }

    .month-option:hover,
    .year-option:hover {
      background: #007bff;
      color: white;
    }

    .day.today {
      position: relative;
      font-weight: bold;
    }

    .day.today::after {
      content: "";
      position: absolute;
      bottom: 20px;
      right: 20px;
      width: 20px;
      height: 20px;
      background-color: #4CAF50;
      border-radius: 50%;
      box-shadow: 0 0 16px 8px rgba(33, 172, 38, 0.4);
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="container">
      <div class="calendar-header">
        <div class="nav-arrow" id="prevMonth">&#8592;</div>
        <div class="header-center">
          <div class="month-label" id="monthBtn"></div>
          <div class="year-label" id="yearBtn"></div>
        </div>
        <div class="nav-arrow" id="nextMonth">&#8594;</div>
      </div>
      <div class="calendar-grid" id="calendarGrid"></div>
    </div>
  </div>

  <!-- Month Modal -->
  <div class="modal" id="monthModal">
    <div class="modal-content">
      <h3>Select Month</h3>
      <div class="month-grid" id="monthGrid"></div>
    </div>
  </div>

  <!-- Year Modal -->
  <div class="modal" id="yearModal">
    <div class="modal-content">
      <h3>Select Year</h3>
      <div class="year-grid" id="yearGrid"></div>
    </div>
  </div>

  <script>
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    const calendarGrid = document.getElementById("calendarGrid");
    const monthBtn = document.getElementById("monthBtn");
    const yearBtn = document.getElementById("yearBtn");
    const monthModal = document.getElementById("monthModal");
    const yearModal = document.getElementById("yearModal");
    const monthGrid = document.getElementById("monthGrid");
    const yearGrid = document.getElementById("yearGrid");

    function updateHeader() {
      monthBtn.innerText = months[currentMonth];
      yearBtn.innerText = currentYear;
    }

    function renderCalendar() {
      calendarGrid.innerHTML = "";
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      daysOfWeek.forEach(day => {
        const div = document.createElement("div");
        div.className = "day-name";
        div.innerText = day;
        calendarGrid.appendChild(div);
      });

      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.className = "day";
        empty.style.visibility = "hidden";
        calendarGrid.appendChild(empty);
      }

      for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "day";
        dayDiv.innerText = i;

        const isToday =
          i === currentDate.getDate() &&
          currentMonth === currentDate.getMonth() &&
          currentYear === currentDate.getFullYear();

        if (isToday) dayDiv.classList.add("today");
        calendarGrid.appendChild(dayDiv);
      }
    }

    function showModal(modal) { modal.style.display = "flex"; }
    function closeModal(modal) { modal.style.display = "none"; }

    monthBtn.onclick = () => showModal(monthModal);
    yearBtn.onclick = () => showModal(yearModal);
    window.onclick = (e) => {
      if (e.target === monthModal) closeModal(monthModal);
      if (e.target === yearModal) closeModal(yearModal);
    };

    document.getElementById("prevMonth").onclick = () => {
      currentMonth--;
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
      updateHeader();
      renderCalendar();
    };

    document.getElementById("nextMonth").onclick = () => {
      currentMonth++;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      updateHeader();
      renderCalendar();
    };

    function generateMonthGrid() {
      monthGrid.innerHTML = "";
      months.forEach((month, index) => {
        const div = document.createElement("div");
        div.className = "month-option";
        div.innerText = month;
        div.onclick = () => {
          currentMonth = index;
          updateHeader();
          renderCalendar();
          closeModal(monthModal);
        };
        monthGrid.appendChild(div);
      });
    }

    function generateYearGrid() {
      yearGrid.innerHTML = "";
      for (let year = 2025; year <= 2070; year++) {
        const div = document.createElement("div");
        div.className = "year-option";
        div.innerText = year;
        div.onclick = () => {
          currentYear = year;
          updateHeader();
          renderCalendar();
          closeModal(yearModal);
        };
        yearGrid.appendChild(div);
      }
    }

    generateMonthGrid();
    generateYearGrid();
    updateHeader();
    renderCalendar();
  </script>
</body>
</html>
