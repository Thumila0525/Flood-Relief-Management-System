<?php
include 'db.php';
include 'helpers.php';

$user = getAuthUser($pdo);

$data = json_decode(file_get_contents("php://input"), true);

$relief_type           = $data['relief_type'] ?? '';
$severity_level        = $data['severity_level'] ?? '';
$district              = $data['district'] ?? '';
$divisional_secretariat= $data['divisional_secretariat'] ?? '';
$gn_division           = $data['gn_division'] ?? '';
$contact_person        = $data['contact_person'] ?? '';
$contact_number        = $data['contact_number'] ?? '';
$address               = $data['address'] ?? '';
$family_members        = $data['family_members'] ?? 0;
$description           = $data['description'] ?? '';

// family_members must be a positive integer — use strict check, not !$family_members (0 is falsy)
if (!$relief_type || !$severity_level || !$district || !$divisional_secretariat || !$gn_division || !$contact_person || !$contact_number || !$address || intval($family_members) < 1) {
    echo json_encode(["success" => false, "message" => "All required fields must be filled"]);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO relief_requests (user_id, relief_type, severity_level, district, divisional_secretariat, gn_division, contact_person, contact_number, address, family_members, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$user['id'], $relief_type, $severity_level, $district, $divisional_secretariat, $gn_division, $contact_person, $contact_number, $address, intval($family_members), $description]);
    echo json_encode(["success" => true, "message" => "Request submitted successfully"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
