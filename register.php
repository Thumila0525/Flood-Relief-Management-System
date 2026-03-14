<?php
include 'db.php';
include 'helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$full_name = trim($data['full_name'] ?? '');
$email     = trim($data['email'] ?? '');
$phone     = trim($data['phone'] ?? '');
$nic       = trim($data['nic'] ?? '');
$address   = trim($data['address'] ?? '');
$password  = $data['password'] ?? '';

if (!$full_name || !$email || !$phone || !$nic || !$address || !$password) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

// Check email exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(["success" => false, "message" => "Email already registered"]);
    exit;
}

// Check NIC exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE nic = ?");
$stmt->execute([$nic]);
if ($stmt->fetch()) {
    echo json_encode(["success" => false, "message" => "NIC already registered"]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

$stmt = $pdo->prepare("INSERT INTO users (full_name, email, phone, nic, address, password) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->execute([$full_name, $email, $phone, $nic, $address, $hashedPassword]);

?>