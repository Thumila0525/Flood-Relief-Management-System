<?php
include 'db.php';
include 'helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(["success" => false, "message" => "Email and password are required"]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password'])) {
    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    exit;
}

// Create simple token
$tokenData = json_encode(['user_id' => $user['id'], 'time' => time()]);
$token = base64_encode($tokenData);

echo json_encode([
    "success" => true,
    "token" => $token,
    "user" => [
        "id" => $user['id'],
        "full_name" => $user['full_name'],
        "email" => $user['email'],
        "role" => $user['role']
    ]
]);
?>