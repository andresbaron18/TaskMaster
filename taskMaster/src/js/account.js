// Load user data from localStorage
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const userNameEl = document.querySelector('#userName');
    if (userNameEl && userData.name) {
        userNameEl.textContent = userData.name;
    } else if (userNameEl) {
        userNameEl.textContent = 'Usuario'; // Fallback if no user data
    }
}

// Select project and redirect to project management page
function selectProject(projectId) {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const selectedProject = projects.find(project =>
        (project.id || project.name || project.proyect) === projectId
    );

    if (selectedProject) {
        // Store the selected project for the project management page
        localStorage.setItem('selectedProject', JSON.stringify(selectedProject));
        // Redirect to project management page
        window.location.href = 'project.html';
    }
}

// Load and display projects from localStorage
function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');

    if (projects.length === 0) {
        // Show empty state
        projectsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <h3 class="empty-state-title">No hay proyectos aún</h3>
                <p class="empty-state-description">Crea tu primer proyecto para comenzar a gestionar tus tareas</p>
                <button id="createFirstProjectBtn" class="btn-primary">Crear Proyecto</button>
            </div>
        `;

        // Add event listener for the create first project button
        setTimeout(() => {
            const createBtn = document.getElementById('createFirstProjectBtn');
            if (createBtn) {
                createBtn.addEventListener('click', openProjectModal);
            }
        }, 100);
        return;
    }

    // Display projects
    projectsGrid.innerHTML = projects.map(project => {
        const startDate = new Date(project.startDate || project.dateIn);
        const endDate = new Date(project.endDate || project.datefinal);
        const now = new Date();

        // Calculate progress (simplified - in a real app this would be based on tasks)
        let progress = 0;
        let status = 'Pendiente';
        let statusClass = 'status-pending';

        if (endDate < now) {
            status = 'Completado';
            statusClass = 'status-completed';
            progress = 100;
        } else if (startDate <= now && endDate >= now) {
            status = 'Activo';
            statusClass = 'status-active';
            progress = Math.min(75, Math.random() * 100); // Random progress for demo
        }

        const createdDate = project.createdAt ? new Date(project.createdAt).toLocaleDateString('es-ES') : 'Fecha no disponible';

        return `
            <div class="project-card-modern" data-project-id="${project.id || project.name || project.proyect}" onclick="selectProject('${project.id || project.name || project.proyect}')">
                <div class="project-header">
                    <h3 class="project-title">${project.name || project.proyect || 'Proyecto sin nombre'}</h3>
                    <span class="project-status ${statusClass}">${status}</span>
                </div>
                <p class="project-description">${project.description || project.explication || 'Sin descripción'}</p>
                <div class="project-meta">
                    <span class="project-date">Creado: ${createdDate}</span>
                    <div class="project-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <span class="progress-text">${Math.round(progress)}%</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Add click event listeners to project cards
    setTimeout(() => {
        document.querySelectorAll('.project-card-modern').forEach(card => {
            card.style.cursor = 'pointer';
        });
    }, 100);
}

// Modal functionality
function openProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.add('show');
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('show');
    clearProjectForm();
}

function clearProjectForm() {
    document.getElementById('projectName').value = '';
    document.getElementById('projectDescription').value = '';
    document.getElementById('projectStartDate').value = '';
    document.getElementById('projectEndDate').value = '';
    document.getElementById('projectBudget').value = '';
    document.getElementById('projectAssignee').value = '';
    document.getElementById('projectPriority').value = 'medium';
    document.getElementById('projectStatus').value = 'in-progress';
}

// Form validation
function validateProjectForm(projectData) {
    if (!projectData.name || !projectData.name.trim()) {
        alert('Please enter a project name.');
        return false;
    }
    if (projectData.endDate && projectData.startDate && new Date(projectData.endDate) < new Date(projectData.startDate)) {
        alert('End date must be after the start date.');
        return false;
    }
    return true;
}

// Handle project creation
function createProject(projectData) {
    // Store in localStorage
    const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    existingProjects.push(projectData);
    localStorage.setItem('projects', JSON.stringify(existingProjects));

    // Show success message
    alert('Project created successfully!');

    // Close modal
    closeProjectModal();

    // Redirect to project management page
    window.location.href = 'project.html';
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    loadProjects();

    // Modal event listeners
    const addProjectBtn = document.getElementById('addProjectBtn');
    const closeModalBtn = document.getElementById('closeProjectModal');
    const cancelBtn = document.getElementById('cancelProjectBtn');
    const projectForm = document.getElementById('projectForm');
    const modal = document.getElementById('projectModal');

    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', openProjectModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeProjectModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeProjectModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProjectModal();
            }
        });
    }

    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const projectData = {
                name: document.getElementById('projectName').value.trim(),
                description: document.getElementById('projectDescription').value.trim(),
                startDate: document.getElementById('projectStartDate').value,
                endDate: document.getElementById('projectEndDate').value,
                budget: document.getElementById('projectBudget').value.trim(),
                assignee: document.getElementById('projectAssignee').value.trim(),
                priority: document.getElementById('projectPriority').value,
                status: document.getElementById('projectStatus').value,
                createdAt: new Date().toISOString(),
                id: Date.now().toString()
            };

            if (validateProjectForm(projectData)) {
                createProject(projectData);
            }
        });
    }
});
