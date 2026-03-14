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

// Show add form
function showAddForm() {
    editingRequestId = null;
    document.getElementById('popupTitle').textContent = 'New Relief Request';
    document.getElementById('requestForm').reset();
    clearMessages();
    document.getElementById('requestPopup').classList.add('show');
}

// Edit request
function editRequest(id) {
    let request = null;
    for (let i = 0; i < allRequests.length; i++) {
        if (allRequests[i].id == id) {
            request = allRequests[i];
            break;
        }
    }
    if (!request) return;

    editingRequestId = id;
    document.getElementById('popupTitle').textContent = 'Edit Relief Request';
    document.getElementById('requestId').value = request.id;
    document.getElementById('reliefType').value = request.relief_type;
    document.getElementById('severity').value = request.severity_level;
    document.getElementById('district').value = request.district;
    document.getElementById('dsDivision').value = request.divisional_secretariat;
    document.getElementById('gnDivision').value = request.gn_division;
    document.getElementById('contactPerson').value = request.contact_person;
    document.getElementById('contactNumber').value = request.contact_number;
    document.getElementById('houseAddress').value = request.address;
    document.getElementById('familyMembers').value = request.family_members;
    document.getElementById('description').value = request.description || '';

    clearMessages();
    document.getElementById('requestPopup').classList.add('show');
}

// Delete request
function deleteRequest(id) {
    if (!confirm('Are you sure you want to delete this request?')) return;

    fetch(API_URL + '/delete_request.php', {
        method: 'DELETE',
        headers: getAuthHeader(),
        body: JSON.stringify({ id: id })
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            loadRequests();
        } else {
            alert(data.message || 'Failed to delete request');
        }
    })
    .catch(() => alert('Error deleting request'));
}

// Submit form 
function submitRequest(e) {
    e.preventDefault();

    const formData = {
        relief_type: document.getElementById('reliefType').value,
        severity_level: document.getElementById('severity').value,
        district: document.getElementById('district').value,
        divisional_secretariat: document.getElementById('dsDivision').value,
        gn_division: document.getElementById('gnDivision').value,
        contact_person: document.getElementById('contactPerson').value,
        contact_number: document.getElementById('contactNumber').value,
        address: document.getElementById('houseAddress').value,
        family_members: parseInt(document.getElementById('familyMembers').value),
        description: document.getElementById('description').value
    };

    const errorDiv = document.getElementById('formError');
    const successDiv = document.getElementById('formSuccess');
    clearMessages();

    let url, method;
    if (editingRequestId) {
        url = API_URL + '/update_request.php';
        method = 'PUT';
        formData.id = editingRequestId;
    } else {
        url = API_URL + '/create_request.php';
        method = 'POST';
    }

    fetch(url, {
        method: method,
        headers: getAuthHeader(),
        body: JSON.stringify(formData)
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            showSuccess(successDiv, 'Request saved successfully!');
            setTimeout(() => {
                closePopup();
                loadRequests();
            }, 1000);
        } else {
            showError(errorDiv, data.message || 'Failed to save request');
        }
    })
    .catch(() => showError(errorDiv, 'Connection error. Please try again.'));
}