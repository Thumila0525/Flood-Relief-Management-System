<?php
include 'db.php';
include 'helpers.php';

requireAdmin($pdo);

// Get filters
$district    = $_GET['district'] ?? '';
$relief_type = $_GET['relief_type'] ?? '';

// Build base WHERE clause from filters
$where = [];
$params = [];

if ($district) {
    $where[] = "district = ?";
    $params[] = $district;
}
if ($relief_type) {
    $where[] = "relief_type = ?";
    $params[] = $relief_type;
}

$whereSQL = count($where) ? "WHERE " . implode(" AND ", $where) : "";

// Total users
$totalUsers = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'user'")->fetchColumn();

// Total requests
$stmt = $pdo->prepare("SELECT COUNT(*) FROM relief_requests $whereSQL");
$stmt->execute($params);
$totalRequests = $stmt->fetchColumn();


?>