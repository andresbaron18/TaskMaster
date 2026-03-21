// DOM Elements
const projectNameInput = document.querySelector('#projectName');
const projectDescriptionInput = document.querySelector('#projectDescription');
const projectStartDateInput = document.querySelector('#projectStartDate');
const projectEndDateInput = document.querySelector('#projectEndDate');
const projectBudgetInput = document.querySelector('#projectBudget');
const projectAssigneeInput = document.querySelector('#projectAssignee');
const projectPrioritySelect = document.querySelector('#projectPriority');
const projectStatusSelect = document.querySelector('#projectStatus');
const createProjectBtn = document.querySelector('#createProject');
const cancelProjectBtn = document.querySelector('#cancelProject');
const closeModalBtn = document.querySelector('#closeModal');
const overlay = document.querySelector('#overlay');

// Modal Controls
closeModalBtn.addEventListener('click', closeModal);
cancelProjectBtn.addEventListener('click', closeModal);

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        closeModal();
    }
});

// Close modal function
function closeModal() {
    // If this is opened in a modal/iframe, close it
    if (window.parent !== window) {
        // Communicate with parent window
        window.parent.postMessage({ action: 'closeModal' }, '*');
    } else {
        // If standalone, redirect or close
        window.location.href = 'account.html';
    }
}

// Form validation
function validateProjectForm() {
    const name = projectNameInput.value.trim();
    const startDate = projectStartDateInput.value;
    const endDate = projectEndDateInput.value;

    if (!name) {
        alert('Please enter a project name.');
        projectNameInput.focus();
        return false;
    }

    if (!startDate) {
        alert('Please select a start date.');
        projectStartDateInput.focus();
        return false;
    }

    if (!endDate) {
        alert('Please select a due date.');
        projectEndDateInput.focus();
        return false;
    }

    if (new Date(endDate) < new Date(startDate)) {
        alert('Due date must be after the start date.');
        projectEndDateInput.focus();
        return false;
    }

    return true;
}

// Create project function
function createProject() {
    if (!validateProjectForm()) return;

    const projectData = {
        name: projectNameInput.value.trim(),
        description: projectDescriptionInput.value.trim(),
        startDate: projectStartDateInput.value,
        endDate: projectEndDateInput.value,
        budget: projectBudgetInput.value.trim(),
        assignee: projectAssigneeInput.value.trim(),
        priority: projectPrioritySelect.value,
        status: projectStatusSelect.value,
        createdAt: new Date().toISOString(),
        id: Date.now().toString()
    };

    // Store in localStorage (in a real app, this would be an API call)
    const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    existingProjects.push(projectData);
    localStorage.setItem('projects', JSON.stringify(existingProjects));

    // Show success message
    alert('Project created successfully!');

    // Communicate with parent window if in iframe
    if (window.parent !== window) {
        window.parent.postMessage({
            action: 'projectCreated',
            project: projectData
        }, '*');
    }

    // Close modal
    closeModal();
}

// Event listeners
createProjectBtn.addEventListener('click', createProject);

// Handle keyboard events
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
    if (e.key === 'Enter' && e.ctrlKey) {
        createProject();
    }
});

// Initialize form with today's date as default start date
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    if (!projectStartDateInput.value) {
        projectStartDateInput.value = today;
    }

    // Focus on project name input
    projectNameInput.focus();
});

// Handle messages from parent window (if in iframe)
window.addEventListener('message', (event) => {
    // You can add custom message handling here if needed
    console.log('Received message:', event.data);
});