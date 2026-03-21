// 1. SELECT EVERYTHING
const buttonModal = document.querySelector('#openModal');
const buttonCancel = document.querySelector('#cancelar');
const buttonCreate = document.querySelector('#crear');
const overlay = document.querySelector('#overlay');
const closeModalBtn = document.querySelector('#closeModal');
const projectCard = document.querySelector('#projectCard');

// Card displays
const displayTitle = document.querySelector(".project-title");
const displayDesc = document.querySelector(".project-description");
const displayStartDate = document.querySelector("#startDate");

// Form inputs
const nameProyect = document.querySelector('#nameProyect');
const description = document.querySelector('#description');
const dateStart = document.querySelector('#dateStart');
const dateEnd = document.querySelector('#dateEnd');
const budget = document.querySelector('#budget');
const assign = document.querySelector('#assign');

// User display element
const userNameEl = document.querySelector('#userName');

// 2. FUNCTIONS
// Load user data from localStorage
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (userNameEl && userData.name) {
        userNameEl.textContent = userData.name;
    } else if (userNameEl) {
        userNameEl.textContent = 'Test User'; // Fallback if no user data
    }
}

// 3. MODAL LOGIC
buttonModal.addEventListener('click', () => {
    overlay.classList.add("show");
});

buttonCancel.addEventListener('click', () => {
    clearModal();
});

closeModalBtn.addEventListener('click', () => {
    clearModal();
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        clearModal();
    }
});

// Clear form and reset modal
function clearModal() {
    overlay.classList.remove('show');

    nameProyect.value = "";
    description.value = "";
    dateStart.value = "";
    dateEnd.value = "";
    budget.value = "";
    assign.value = "";
}

// Validation function
function validateProject(project) {
    if (!project.proyect.trim()) {
        alert('Please enter the project name.');
        return false;
    }
    if (!project.dateIn) {
        alert('Please enter the start date.');
        return false;
    }
    if (!project.datefinal) {
        alert('Please enter the due date.');
        return false;
    }
    if (new Date(project.datefinal) < new Date(project.dateIn)) {
        alert('Due date must be after the start date.');
        return false;
    }
    return true;
}

// 3. SAVE LOGIC
buttonCreate.addEventListener('click', (e) => {
    e.preventDefault();

    const informationProject = {
        proyect: nameProyect.value.trim(),
        explication: description.value.trim(),
        dateIn: dateStart.value,
        datefinal: dateEnd.value,
        money: budget.value.trim(),
        person: assign.value.trim()
    };

    if (!validateProject(informationProject)) return;

    localStorage.setItem("projectData", JSON.stringify(informationProject));
    showProject();
    clearModal();
    projectCard.style.display = "block"; // Show the project card
});

// 4. SHOW LOGIC
function showProject() {
    const savedData = localStorage.getItem("projectData");
    if (!savedData) return;

    const data = JSON.parse(savedData);

    displayTitle.textContent = data.proyect || "Untitled Project";
    displayDesc.textContent = data.explication || "No description provided.";
    displayStartDate.textContent = data.dateIn || "--";

    // Update project status based on dates
    const today = new Date();
    const startDate = new Date(data.dateIn);
    const endDate = new Date(data.datefinal);

    const statusElement = document.querySelector('.project-status');
    if (endDate < today) {
        statusElement.textContent = 'Completed';
        statusElement.className = 'project-status status-completed';
    } else if (startDate <= today && endDate >= today) {
        statusElement.textContent = 'Active';
        statusElement.className = 'project-status status-active';
    } else {
        statusElement.textContent = 'Pending';
        statusElement.className = 'project-status status-pending';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    showProject();
    // Check if there's saved data and show the card
    const savedData = localStorage.getItem("projectData");
    if (savedData) {
        projectCard.style.display = "block";
    }
});

// 5. PROJECT ACTIONS