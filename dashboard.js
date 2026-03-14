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

// Load requests
function loadRequests() {
    fetch(API_URL + '/get_user_requests.php', {
        method: 'GET',
        headers: getAuthHeader()
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            allRequests = data.requests || [];
            displayRequests();
        } else {
            showNoRequests();
        }
    })
    .catch(() => showNoRequests());
}

// Display requests 
function displayRequests() {
    const container = document.getElementById('requestsList');
    const noRequestsDiv = document.getElementById('noRequests');

    if (allRequests.length === 0) {
        container.innerHTML = '';
        noRequestsDiv.style.display = 'block';
        return;
    }

    noRequestsDiv.style.display = 'none';

    let html = '<table><thead><tr><th>Type</th><th>Severity</th><th>District</th><th>DS Division</th><th>GN Division</th><th>Contact</th><th>Phone</th><th>Family</th><th>Actions</th></tr></thead><tbody>';

    for (let i = 0; i < allRequests.length; i++) {
        const req = allRequests[i];
        html += `
            <tr>
                <td>${req.relief_type}</td>
                <td><span class="badge ${req.severity_level.toLowerCase()}">${req.severity_level}</span></td>
                <td>${req.district}</td>
                <td>${req.divisional_secretariat}</td>
                <td>${req.gn_division}</td>
                <td>${req.contact_person}</td>
                <td>${req.contact_number}</td>
                <td>${req.family_members}</td>
                <td>
                    <button onclick="editRequest(${req.id})" class="btn" style="width:auto; margin:2px;">Edit</button>
                    <button onclick="deleteRequest(${req.id})" class="btn-danger" style="width:auto; margin:2px;">Delete</button>
                </td>
            </tr>
        `;
    }

    html += '</tbody></table>';
    container.innerHTML = html;
}

function showNoRequests() {
    document.getElementById('requestsList').innerHTML = '';
    document.getElementById('noRequests').style.display = 'block';
}