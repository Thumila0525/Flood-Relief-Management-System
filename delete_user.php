<?php
include 'db.php';
include 'helpers.php';

requireAdmin($pdo);

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? '';

if (!$user_id) {
    echo json_encode(["success" => false, "message" => "User ID required"]);
    exit;
}

// Delete user's relief requests first to avoid orphaned records
$stmt = $pdo->prepare("DELETE FROM relief_requests WHERE user_id = ?");
$stmt->execute([$user_id]);

$stmt = $pdo->prepare("DELETE FROM users WHERE id = ? AND role = 'user'");
$stmt->execute([$user_id]);

if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => true, "message" => "User deleted"]);
} else {
    echo json_encode(["success" => false, "message" => "User not found"]);
}
?>
