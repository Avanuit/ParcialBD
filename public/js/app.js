// Register candidate elements
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const skillSelect = document.getElementById("skillSelect");
const skillLevelInput = document.getElementById("skillLevel");
const addSkillBtn = document.getElementById("addSkillBtn");
const skillList = document.getElementById("skillList");
const registerCandidateBtn = document.getElementById("registerCandidateBtn");

// Apply elements
const applyOfferIdInput = document.getElementById("applyOfferId");
const applyCandidateIdInput = document.getElementById("applyCandidateId");
const applyBtn = document.getElementById("applyBtn");

// Status elements
const applicationIdInput = document.getElementById("applicationId");
const checkStatusBtn = document.getElementById("checkStatusBtn");

// Offers elements
const getOffersBtn = document.getElementById("getOffersBtn");

const pendingSkills = [];
const LEVEL_LABELS = { 1: 'Basic', 2: 'Intermediate', 3: 'Advanced' };

addSkillBtn.addEventListener("click", function () {
    const name = skillSelect.value;
    const level = parseInt(skillLevelInput.value);

    if (!name || !level) return;

    // Avoid duplicate skill entries
    if (pendingSkills.some(skill => skill.name === name)) {
        alert(`Skill "${name}" is already added.`);
        return;
    }

    pendingSkills.push({ name, level });

    const li = document.createElement("li");
    li.textContent = `${name} - Level ${level} (${LEVEL_LABELS[level]})`;
    skillList.appendChild(li);

    skillLevelInput.value = "";
});

registerCandidateBtn.addEventListener("click", async function () {
    const data = {
        full_name: fullNameInput.value,
        email: emailInput.value,
        skills: [...pendingSkills]
    };

    try {
        const response = await fetch("/talent/candidates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        document.getElementById("registerResult").innerText = response.ok
            ? `Candidate registered. ID: ${result.id}`
            : `Error: ${result.error}`;
    } catch (error) {
        document.getElementById("registerResult").innerText = "Connection error.";
    }
});

getOffersBtn.addEventListener("click", async function () {
    try {
        const response = await fetch("/jobs/offers");
        const data = await response.json();

        const tbody = document.getElementById("offersBody");
        const table = document.getElementById("offersTable");
        const errorMsg = document.getElementById("offersError");
        tbody.innerHTML = "";

        if (!data || data.length === 0) {
            errorMsg.innerText = "No offers available.";
            table.style.display = "none";
            return;
        }

        errorMsg.innerText = "";

        data.forEach(offer => {
            const skillsText = offer.required_skills.length > 0
                ? offer.required_skills.map(skill =>
                    `${skill.skill_name} (min: ${LEVEL_LABELS[skill.min_level]})`
                  ).join(", ")
                : "None";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td style="padding:6px">${offer.id}</td>
                <td style="padding:6px">${offer.title}</td>
                <td style="padding:6px">${offer.company}</td>
                <td style="padding:6px">${skillsText}</td>
            `;
            tbody.appendChild(row);
        });

        table.style.display = "table";
    } catch (error) {
        document.getElementById("offersError").innerText = "Connection error.";
    }
});

applyBtn.addEventListener("click", async function () {
    const data = {
        offer_id: parseInt(applyOfferIdInput.value),
        candidate_id: parseInt(applyCandidateIdInput.value)
    };

    try {
        const response = await fetch("/jobs/applications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        document.getElementById("applyResult").innerText = response.ok
            ? `Application submitted. ID: ${result.id} | Status: ${result.status}`
            : `Error: ${result.error}`;
    } catch (error) {
        document.getElementById("applyResult").innerText = "Connection error.";
    }
});

checkStatusBtn.addEventListener("click", async function () {
    const appId = applicationIdInput.value;

    try {
        const response = await fetch(`/jobs/applications/${appId}`);
        const data = await response.json();
        const container = document.getElementById("statusResult");
        container.innerHTML = "";

        if (!response.ok) {
            container.innerHTML = `<li>Error: ${data.error}</li>`;
            return;
        }

        Object.entries(data).forEach(([key, value]) => {
            const li = document.createElement("li");
            li.textContent = `${key}: ${value}`;
            container.appendChild(li);
        });
    } catch (error) {
        document.getElementById("statusResult").innerHTML = "<li>Connection error.</li>";
    }
});