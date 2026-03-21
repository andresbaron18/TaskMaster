// DOM Elements
const taskNameInput = document.querySelector('#taskName');
const taskDescriptionInput = document.querySelector('#taskDescription');
const taskStartDateInput = document.querySelector('#taskStartDate');
const taskEndDateInput = document.querySelector('#taskEndDate');
const taskBudgetInput = document.querySelector('#taskBudget');
const taskAssigneeInput = document.querySelector('#taskAssignee');
const taskStatusSelect = document.querySelector('#taskStatus');
const taskPrioritySelect = document.querySelector('#taskPriority');
const createTaskBtn = document.querySelector('#createTask');
const cancelTaskBtn = document.querySelector('#cancelTask');
const closeModalBtn = document.querySelector('#closeModal');
const overlay = document.querySelector('#overlay');

// Modal Controls
closeModalBtn.addEventListener('click', closeModal);
cancelTaskBtn.addEventListener('click', closeModal);

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
        window.location.href = 'project.html';
    }
}

// Form validation
function validateTaskForm() {
    const name = taskNameInput.value.trim();
    const startDate = taskStartDateInput.value;
    const endDate = taskEndDateInput.value;

    if (!name) {
        alert('Please enter a task name.');
        taskNameInput.focus();
        return false;
    }

    if (!startDate) {
        alert('Please select a start date.');
        taskStartDateInput.focus();
        return false;
    }

    if (!endDate) {
        alert('Please select a due date.');
        taskEndDateInput.focus();
        return false;
    }

    if (new Date(endDate) < new Date(startDate)) {
        alert('Due date must be after the start date.');
        taskEndDateInput.focus();
        return false;
    }

    return true;
}

// Create task function
function createTask() {
    if (!validateTaskForm()) return;

    const taskData = {
        Homework: taskNameInput.value.trim(),
        Description: taskDescriptionInput.value.trim(),
        DateStart: taskStartDateInput.value,
        DateEnd: taskEndDateInput.value,
        StatusHomework: taskStatusSelect.value,
        Priority: taskPrioritySelect.value,
        BudgetHomework: taskBudgetInput.value.trim(),
        AssignHomework: taskAssigneeInput.value.trim(),
        createdAt: new Date().toISOString(),
        id: Date.now().toString()
    };

    // Store in localStorage (in a real app, this would be an API call)
    const existingTasks = JSON.parse(localStorage.getItem("allHomeworks") || '[]');
    existingTasks.push(taskData);
    localStorage.setItem("allHomeworks", JSON.stringify(existingTasks));

    // Show success message
    alert('Task created successfully!');

    // Communicate with parent window if in iframe
    if (window.parent !== window) {
        window.parent.postMessage({
            action: 'taskCreated',
            task: taskData
        }, '*');
    }

    // Close modal
    closeModal();
}

// Event listeners
createTaskBtn.addEventListener('click', createTask);

// Handle keyboard events
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
    if (e.key === 'Enter' && e.ctrlKey) {
        createTask();
    }
});

// Initialize form with today's date as default start date
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    if (!taskStartDateInput.value) {
        taskStartDateInput.value = today;
    }

    // Focus on task name input
    taskNameInput.focus();
});

// Handle messages from parent window (if in iframe)
window.addEventListener('message', (event) => {
    // You can add custom message handling here if needed
    console.log('Received message:', event.data);
});