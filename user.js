const API_URL = "http://localhost/floodrelief";

// Admin Password
const ADMIN_PASSWORD = "admin1234";

// When page loads
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Show admin login form
function showAdminLogin() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('adminLoginForm').style.display = 'block';
    document.getElementById('adminPassword').value = '';
    const err = document.getElementById('adminError');
    err.textContent = '';
    err.style.display = 'none';
}
