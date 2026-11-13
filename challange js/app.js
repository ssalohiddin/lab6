// Enrolment: 2749 - Started: Nov 13, 2026

document.addEventListener("DOMContentLoaded", () => {
    const M_LIMIT = 22; // Name max characters
    const P_MIN = 7;    // Password min length
    const PASS_MARK = 49; // T value

    // --- PAGE 1: REGISTRATION ---
    const form = document.getElementById("regForm");
    if (form) {
        const nameInput = document.getElementById("fullName");
        const charCount = document.getElementById("charCount");
        const citySelect = document.getElementById("city");
        const cityChoice = document.getElementById("cityChoice");

        // Keyup: Character count
        nameInput.addEventListener("keyup", () => {
            const remaining = M_LIMIT - nameInput.value.length;
            charCount.textContent = `${remaining} characters left`;
            if (remaining < 0) {
                charCount.style.color = "#d32f2f";
            } else {
                charCount.style.color = "#333";
            }
        });

        // Blur: invalid red border
        const inputs = form.querySelectorAll("input, select");
        inputs.forEach(input => {
            input.addEventListener("blur", () => {
                if (!input.checkValidity() && input.value !== "") {
                    input.classList.add("invalid");
                } else {
                    input.classList.remove("invalid");
                }
            });
        });

        // Change: City update text
        citySelect.addEventListener("change", () => {
            if (citySelect.value !== "") {
                cityChoice.textContent = `You chose ${citySelect.value}`;
            } else {
                cityChoice.textContent = "";
            }
        });

        // Submit handler
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const errorList = document.getElementById("errorList");
            errorList.textContent = "";
            let errors = [];

            const emailInput = document.getElementById("email");
            const phoneInput = document.getElementById("phone");
            const passInput = document.getElementById("password");
            const confirmInput = document.getElementById("confirmPassword");

            // Validations
            if (!nameInput.value.trim() || nameInput.value.length > M_LIMIT) {
                errors.push(`Name is required and must be under ${M_LIMIT} characters.`);
            }
            if (!emailInput.value.includes("@") || !emailInput.value.includes(".")) {
                errors.push("Enter a valid email address.");
            }
            const phoneRegex = /^\d{9}$/;
            if (!phoneRegex.test(phoneInput.value)) {
                errors.push("Phone must be exactly 9 digits.");
            }
            if (passInput.value.length < P_MIN) {
                errors.push(`Password must be at least ${P_MIN} characters long.`);
            }
            if (passInput.value !== confirmInput.value) {
                errors.push("Passwords do not match.");
            }
            if (!citySelect.value) {
                errors.push("Please select a city.");
            }

            if (errors.length > 0) {
                errors.forEach(err => {
                    const li = document.createElement("li");
                    li.textContent = err;
                    errorList.appendChild(li);
                });
            } else {
                const userName = nameInput.value.trim();
                const confirmed = window.confirm(`Register ${userName}?`);
                if (confirmed) {
                    window.location.href = `board.html?name=${encodeURIComponent(userName)}`;
                }
            }
        });
    }

    // --- PAGE 2: MARKS BOARD ---
    const tableBody = document.getElementById("tableBody");
    if (tableBody) {
        // Read URL parameters
        const params = new URLSearchParams(location.search);
        const visitorName = params.get("name") || "Student";
        document.getElementById("welcomeHeading").textContent = `Welcome, ${visitorName}`;
        
        const now = new Date();
        document.getElementById("loadTime").textContent = `Loaded at: ${now.toLocaleTimeString()}`;

        // Back button
        document.getElementById("backBtn").addEventListener("click", () => {
            history.back();
        });

        // Grade function
        function getGrade(marks) {
            if (marks < PASS_MARK) return "Fail";
            if (marks <= 75) return "Pass";
            return "Distinction";
        }

        let studentsData = [];

        async function loadStudents() {
            try {
                const response = await fetch("students.json");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                studentsData = await response.json();
                renderTable(studentsData);
            } catch (err) {
                const errorContainer = document.getElementById("errorContainer");
                errorContainer.textContent = `Failed to load students data: ${err.message}`;
                errorContainer.style.color = "#d32f2f";
            }
        }

        function renderTable(data) {
            tableBody.textContent = "";
            data.forEach(student => {
                const tr = document.createElement("tr");

                const tdName = document.createElement("td");
                tdName.textContent = student.name;
                tr.appendChild(tdName);

                const tdCity = document.createElement("td");
                tdCity.textContent = student.city;
                tr.appendChild(tdCity);

                const tdMarks = document.createElement("td");
                tdMarks.textContent = student.marks;
                tr.appendChild(tdMarks);

                const tdGrade = document.createElement("td");
                tdGrade.textContent = getGrade(student.marks);
                tr.appendChild(tdGrade);

                tableBody.appendChild(tr);
            });
        }

        // Sorting
        const sortSelect = document.getElementById("sortSelect");
        sortSelect.addEventListener("change", () => {
            const sortBy = sortSelect.value;
            let sorted = [...studentsData];
            if (sortBy === "name") {
                sorted.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortBy === "marks") {
                sorted.sort((a, b) => b.marks - a.marks);
            }
            renderTable(sorted);
        });

        loadStudents();
    }
});

console.log("Enrolment Number: 2749");