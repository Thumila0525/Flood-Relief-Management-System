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

// Show normal user login form
function showUserLogin() {
    document.getElementById('adminLoginForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}


// Handle admin password check
function handleAdminLogin(e) {
    e.preventDefault();
    const entered = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('adminError');

    if (entered === ADMIN_PASSWORD) {
        // Store a temporary admin session and go to admin page
        localStorage.setItem('user', JSON.stringify({
            id: 0,
            full_name: 'Administrator',
            email: 'admin@system',
            role: 'admin'
        }));
        localStorage.setItem('token', btoa(JSON.stringify({ user_id: 0, time: Date.now() })));
        window.location.href = 'admin.html';
    } else {
        errorDiv.textContent = 'Incorrect admin password. Please try again.';
        errorDiv.style.display = 'block';
        errorDiv.style.backgroundColor = '#f8d7da';
        errorDiv.style.color = '#721c24';
        errorDiv.style.padding = '12px';
        errorDiv.style.borderRadius = '5px';
        document.getElementById('adminPassword').value = '';
    }
}
