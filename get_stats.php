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

// Severity counts
$stmt = $pdo->prepare("SELECT COUNT(*) FROM relief_requests " . addCondition($whereSQL, "severity_level = 'High'"));
$stmt->execute($params);
$highSeverity = $stmt->fetchColumn();

$stmt = $pdo->prepare("SELECT COUNT(*) FROM relief_requests " . addCondition($whereSQL, "severity_level = 'Medium'"));
$stmt->execute($params);
$mediumSeverity = $stmt->fetchColumn();

$stmt = $pdo->prepare("SELECT COUNT(*) FROM relief_requests " . addCondition($whereSQL, "severity_level = 'Low'"));
$stmt->execute($params);
$lowSeverity = $stmt->fetchColumn();

// Relief type counts
$types = ['Food', 'Water', 'Medicine', 'Shelter'];
$typeCounts = [];
foreach ($types as $type) {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM relief_requests " . addCondition($whereSQL, "relief_type = ?"));
    $stmt->execute(array_merge($params, [$type]));
    $typeCounts[strtolower($type) . '_requests'] = (int)$stmt->fetchColumn();
}

echo json_encode([
    "success" => true,
    "stats" => array_merge([
        "total_users"     => (int)$totalUsers,
        "total_requests"  => (int)$totalRequests,
        "high_severity"   => (int)$highSeverity,
        "medium_severity" => (int)$mediumSeverity,
        "low_severity"    => (int)$lowSeverity,
    ], $typeCounts)
]);


?>