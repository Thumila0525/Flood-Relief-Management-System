<?php
include 'db.php';
include 'helpers.php';

requireAdmin($pdo);

$user_id = $_GET['user_id'] ?? '';

if (!$user_id) {
    echo json_encode(["success" => false, "message" => "User ID required"]);
    exit;
}

// Get user
$stmt = $pdo->prepare("SELECT id, full_name, email, phone, nic, address FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit;
}

// Get user's requests
$stmt = $pdo->prepare("SELECT * FROM relief_requests WHERE user_id = ? ORDER BY created_at DESC");
$stmt->execute([$user_id]);
$requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "user" => $user, "requests" => $requests]);
?>
