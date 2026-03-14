const API_URL = "http://localhost/floodrelief";

// Shared Auth & UI Functions 

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

let currentUser = null;
let allRequests = [];
let editingRequestId = null;

// Page load
document.addEventListener('DOMContentLoaded', function() {
    currentUser = checkAuth();
    if (!currentUser) return;

    if (currentUser.role === 'admin') {
        window.location.href = 'admin.html';
        return;
    }

    document.getElementById('userName').textContent = 'Welcome, ' + currentUser.full_name;
    loadRequests();
    document.getElementById('requestForm').addEventListener('submit', submitRequest);
});