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
// Page load
document.addEventListener('DOMContentLoaded', function() {
    currentUser = checkAuth();
    if (!currentUser) return;

    if (currentUser.role !== 'admin') {
        window.location.href = 'dashbord.html';
        return;
    }

    document.getElementById('adminName').textContent = 'Admin: ' + currentUser.full_name;
    loadStats();
    loadUsers();
    document.getElementById('searchUsers').addEventListener('input', searchUsers);

    // Auto-refresh stats every 30 seconds so new data always shows
    setInterval(function() {
        const summaryVisible = document.getElementById('summaryTab').style.display !== 'none';
        if (summaryVisible) loadStats();
    }, 30000);
});
// Load stats
function loadStats(filters) {
    let url = API_URL + '/get_stats.php';
    if (filters) {
        url += '?' + new URLSearchParams(filters).toString();
    }

    fetch(url, { method: 'GET', headers: getAuthHeader() })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            displayStats(data.stats);
        } else {
            console.error('Stats error:', data.message);
        }
    })
    .catch(err => console.error('Stats fetch error:', err));
}

// Display stats
function displayStats(stats) {
    document.getElementById('totalUsers').textContent = stats.total_users || 0;
    document.getElementById('totalRequests').textContent = stats.total_requests || 0;
    document.getElementById('highSeverity').textContent = stats.high_severity || 0;
    document.getElementById('mediumSeverity').textContent = stats.medium_severity || 0;
    document.getElementById('lowSeverity').textContent = stats.low_severity || 0;
    document.getElementById('foodRequests').textContent = stats.food_requests || 0;
    document.getElementById('waterRequests').textContent = stats.water_requests || 0;
    document.getElementById('medicineRequests').textContent = stats.medicine_requests || 0;
    document.getElementById('shelterRequests').textContent = stats.shelter_requests || 0;
}
