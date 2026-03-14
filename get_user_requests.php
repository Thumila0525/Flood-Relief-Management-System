<?php
include 'db.php';
include 'helpers.php';

$user = getAuthUser($pdo);

$stmt = $pdo->prepare("SELECT * FROM relief_requests WHERE user_id = ? ORDER BY created_at DESC");
$stmt->execute([$user['id']]);
$requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "requests" => $requests]);
?>
