const API_URL = "http://localhost/floodrelief";

// ---- Shared Auth & UI Functions ----

function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(user);
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

function getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    };
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    element.style.backgroundColor = '#f8d7da';
    element.style.color = '#721c24';
    element.style.padding = '12px';
    element.style.borderRadius = '5px';
    element.style.marginBottom = '15px';
}

function showSuccess(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    element.style.backgroundColor = '#d4edda';
    element.style.color = '#155724';
    element.style.padding = '12px';
    element.style.borderRadius = '5px';
    element.style.marginBottom = '15px';
}

// ---- End Shared Functions ----

let currentUser = null;
let allUsers = [];
let deleteUserId = null;

// Switch tabs
function showTab(tabName) {
    document.getElementById('summaryTab').style.display = 'none';
    document.getElementById('usersTab').style.display = 'none';

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(t => t.classList.remove('active'));

    if (tabName === 'summary') {
        document.getElementById('summaryTab').style.display = 'block';
        tabs[0].classList.add('active');
        loadStats();  // always reload fresh
    } else if (tabName === 'users') {
        document.getElementById('usersTab').style.display = 'block';
        tabs[1].classList.add('active');
        loadUsers();  // always reload fresh
    }
}
