const button = document.querySelector("#registro");
const inicioSesion = document.getElementById("inicioSesion");
const form = document.querySelector(".login-form");

// Handle form submission
form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form data
    const nombre = document.getElementById("nombre").value.trim();
    const rol = document.getElementById("rol").value;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Basic validation
    if (!nombre || !email || !password) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    // Store user data in localStorage
    const userData = {
        name: nombre,
        role: rol,
        email: email,
        password: password, // Note: In a real app, never store passwords in plain text
        registeredAt: new Date().toISOString()
    };

    localStorage.setItem('userData', JSON.stringify(userData));

    // Redirect to account page
    window.location.href = "account.html";
});

inicioSesion.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "account.html";
});

