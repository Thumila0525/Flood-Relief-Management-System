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

// Login
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');

    errorDiv.textContent = '';
    errorDiv.style.display = 'none';

    fetch(API_URL + '/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);

            if (data.user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'dashbord.html';
            }
        } else {
            showError(errorDiv, data.message || 'Login failed');
        }
    })
    .catch(() => showError(errorDiv, 'Connection error. Please try again.'));
}


// Register
function handleRegister(e) {
    e.preventDefault();

    const full_name = document.getElementById('fullName').value;
    const email = document.getElementById('emailReg').value;
    const phone = document.getElementById('phone').value;
    const nic = document.getElementById('nic').value;
    const address = document.getElementById('address').value;
    const password = document.getElementById('passwordReg').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');

    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
    successDiv.textContent = '';
    successDiv.style.display = 'none';

    if (password !== confirmPassword) {
        showError(errorDiv, 'Passwords do not match');
        return;
    }

    fetch(API_URL + '/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, email, phone, nic, address, password })
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            showSuccess(successDiv, 'Registration successful! Redirecting to login...');
            document.getElementById('registerForm').reset();
            setTimeout(() => { window.location.href = 'login.html'; }, 2000);
        } else {
            showError(errorDiv, data.message || 'Registration failed');
        }
    })
    .catch(() => showError(errorDiv, 'Connection error. Please try again.'));
}
