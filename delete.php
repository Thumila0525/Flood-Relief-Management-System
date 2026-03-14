<?php
include 'db.php';
include 'helpers.php';

$user = getAuthUser($pdo);

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? '';

if (!$id) {
    echo json_encode(["success" => false, "message" => "Request ID required"]);
    exit;
}

$stmt = $pdo->prepare("DELETE FROM relief_requests WHERE id = ? AND user_id = ?");
$stmt->execute([$id, $user['id']]);

if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => true, "message" => "Request deleted"]);
} else {
    echo json_encode(["success" => false, "message" => "Request not found"]);
}
?>
