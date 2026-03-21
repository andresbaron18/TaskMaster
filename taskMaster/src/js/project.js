// 1. SELECT EVERYTHING
const btnCreateHomework = document.querySelector('#addHomework');
const overlay = document.querySelector('#overlay');
const buttonCreate = document.querySelector('#createHomework');
const buttonCancel = document.querySelector('#cancelHomerwork');
const closeModalBtn = document.querySelector('#closeModal');

// Stats elements
const totalTasksEl = document.querySelector('#totalTasks');
const completedTasksEl = document.querySelector('#completedTasks');
const pendingTasksEl = document.querySelector('#pendingTasks');
const overdueTasksEl = document.querySelector('#overdueTasks');

// User display element
const userNameEl = document.querySelector('#userName');

// Form inputs
const nameHomework = document.querySelector('#nameHomework');
const descriptionHomework = document.querySelector('#descriptionHomerwork');
const dateStartHomework = document.querySelector('#dateStart');
const dateEndHomework = document.querySelector('#dateEnd');
const stackStatus = document.querySelector('#taskStatus');
const budgetHomework = document.querySelector('#budget');
const assignHomerwork = document.querySelector('#assign');
const priority = document.querySelector('#priorityStatus');

// 2. FUNCTIONS
// Load user data from localStorage
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (userNameEl && userData.name) {
        userNameEl.textContent = userData.name;
    } else if (userNameEl) {
        userNameEl.textContent = 'User'; // Fallback if no user data
    }
}

// Load selected project from localStorage
function loadSelectedProject() {
    const selectedProject = JSON.parse(localStorage.getItem('selectedProject'));
    if (selectedProject) {
        // Update page title with project name
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            pageTitle.textContent = selectedProject.name || selectedProject.proyect || 'Project Tasks';
        }

        // Update page subtitle
        const pageSubtitle = document.querySelector('.page-subtitle');
        if (pageSubtitle) {
            pageSubtitle.textContent = `Managing tasks for: ${selectedProject.name || selectedProject.proyect || 'Selected Project'}`;
        }

        // Store project reference for task operations
        window.currentProject = selectedProject;
    }
}

// Get project-specific task storage key
function getProjectTaskKey() {
    if (window.currentProject) {
        const projectId = window.currentProject.id || window.currentProject.name || window.currentProject.proyect;
        return `tasks_${projectId}`;
    }
    return "allHomeworks"; // Fallback for backward compatibility
}

// 3. MODAL HOMEWORK LOGIC

btnCreateHomework.addEventListener('click', () => {
    editingIndex = null;
    buttonCreate.textContent = 'Create Task';
    overlay.classList.add("show");
});

buttonCancel.addEventListener('click', () => {
    clearModalHomework();
    overlay.classList.remove('show');
});

closeModalBtn.addEventListener('click', () => {
    clearModalHomework();
    overlay.classList.remove('show');
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        clearModalHomework();
        overlay.classList.remove('show');
    }
});

// Clear form and reset button
function clearModalHomework() {
    nameHomework.value = '';
    descriptionHomework.value = '';
    dateStartHomework.value = '';
    dateEndHomework.value = '';
    stackStatus.value = 'En curso';
    priority.value = 'Alto';
    budgetHomework.value = '';
    assignHomerwork.value = '';
    editingIndex = null;
    buttonCreate.textContent = 'Create Task';
}

// Validation function
function validateHomework(task) {
    if (!task.Homework.trim()) {
        alert('Please enter the task name.');
        return false;
    }
    if (!task.DateStart) {
        alert('Please enter the start date.');
        return false;
    }
    if (!task.DateEnd) {
        alert('Please enter the due date.');
        return false;
    }
    if (new Date(task.DateEnd) < new Date(task.DateStart)) {
        alert('Due date must be after the start date.');
        return false;
    }
    return true;
}

// 3. SAVE LOGIC

buttonCreate.addEventListener('click', (e) => {
    e.preventDefault();

    const homeworkInformation = {
        Homework: nameHomework.value.trim(),
        Description: descriptionHomework.value.trim(),
        DateStart: dateStartHomework.value,
        DateEnd: dateEndHomework.value,
        StatusHomework: stackStatus.value,
        Priority: priority.value,
        BudgetHomework: budgetHomework.value.trim(),
        AssignHomework: assignHomerwork.value.trim()
    }

    if (!validateHomework(homeworkInformation)) return;

    const currentList = JSON.parse(localStorage.getItem(getProjectTaskKey())) || [];

    if (editingIndex !== null){ //is null if the user does not edit
        currentList[editingIndex] = homeworkInformation; //replaces the object with the new form data
        editingIndex = null; //Reset to null so the system knows it is a new task and not an edit.
    }else{ //If null, it means the user is not editing — they are creating a new task.
        currentList.push(homeworkInformation); //Add the new object to the end of the array normally.
    }

    localStorage.setItem(getProjectTaskKey(), JSON.stringify(currentList));
    newHomework();
    updateStats();
    clearModalHomework();
    overlay.classList.remove('show');
});

//4. UI LOGIC
function getStatusClass(status){
    if(status === "En curso") return "status-in-progress";
    if(status === "Completado") return "status-completed";
    if(status === "Pendiente") return "status-pending";
    return "status-pending";
}

function getPriorityClass(priority){
    if(priority === "Alto") return "priority-high";
    if(priority === "Medio") return "priority-medium";
    if(priority === "Bajo") return "priority-low";
    return "priority-medium";
}

// Update stats cards
function updateStats() {
    const tasks = JSON.parse(localStorage.getItem(getProjectTaskKey())) || [];
    const now = new Date();

    let total = tasks.length;
    let completed = 0;
    let pending = 0;
    let overdue = 0;

    tasks.forEach(task => {
        if (task.StatusHomework === "Completado") {
            completed++;
        } else if (task.StatusHomework === "En curso") {
            pending++;
        } else {
            pending++;
        }

        // Check if overdue
        if (task.DateEnd && new Date(task.DateEnd) < now && task.StatusHomework !== "Completado") {
            overdue++;
        }
    });

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
    overdueTasksEl.textContent = overdue;
}

function newHomework(){
    const savedDataHomework = localStorage.getItem(getProjectTaskKey());
    if(!savedDataHomework) return;

    const data = JSON.parse(savedDataHomework);
    const tableBody = document.querySelector('#tasksTableBody');
    tableBody.innerHTML = "";

    data.forEach((item, index) => {
        const statusClass = getStatusClass(item.StatusHomework);
        const priorityClass = getPriorityClass(item.Priority);

        tableBody.innerHTML += `
            <tr>
                <td>${item.Homework}</td>
                <td>${item.Description || '-'}</td>
                <td>${item.DateStart || '-'}</td>
                <td>${item.DateEnd || '-'}</td>
                <td><span class="status-badge ${statusClass}">${item.StatusHomework}</span></td>
                <td><span class="status-badge ${priorityClass}">${item.Priority}</span></td>
                <td>${item.BudgetHomework ? '$' + item.BudgetHomework : '-'}</td>
                <td>${item.AssignHomework || '-'}</td>
                <td class="action-buttons">
                    <button class="btn-action btn-edit" data-index="${index}">
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                        </svg>
                        Edit
                    </button>
                    <button class="btn-action btn-delete" data-index="${index}">
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

// Event delegation for edit/delete buttons
document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-edit')) {
        const index = Number(e.target.closest('.btn-edit').dataset.index);
        editHomework(index);
    }
    if (e.target.closest('.btn-delete')) {
        const index = Number(e.target.closest('.btn-delete').dataset.index);
        deleteHomework(index);
    }
});

window.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    loadSelectedProject();
    newHomework();
    updateStats();
});

let editingIndex = null;
// 5. EDIT LOGIC
window.editHomework = function(index) {

    editingIndex = index;

    const list = JSON.parse(localStorage.getItem(getProjectTaskKey())) || [];
    const item = list[index];

    nameHomework.value = item.Homework;
    descriptionHomework.value = item.Description;
    dateStartHomework.value = item.DateStart;
    dateEndHomework.value = item.DateEnd;
    stackStatus.value = item.StatusHomework;
    priority.value = item.Priority;
    budgetHomework.value = item.BudgetHomework;
    assignHomerwork.value = item.AssignHomework;

    buttonCreate.textContent = 'Update Task';
    overlay.classList.add("show");

}

// 6. DELETE LOGIC
window.deleteHomework = function(index) {
    if(!confirm('Are you sure you want to delete this task?')) return;

    const list = JSON.parse(localStorage.getItem(getProjectTaskKey())) || [];
    list.splice(index, 1);
    localStorage.setItem(getProjectTaskKey(), JSON.stringify(list));
    newHomework();
    updateStats();
}
