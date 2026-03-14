<?php
include 'db.php';
include 'helpers.php';

$user = getAuthUser($pdo);

$data = json_decode(file_get_contents("php://input"), true);

$id                    = $data['id'] ?? '';
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

if (!$id) {
    echo json_encode(["success" => false, "message" => "Request ID required"]);
    exit;
}

// Make sure request belongs to user
$stmt = $pdo->prepare("SELECT id FROM relief_requests WHERE id = ? AND user_id = ?");
$stmt->execute([$id, $user['id']]);
if (!$stmt->fetch()) {
    echo json_encode(["success" => false, "message" => "Request not found"]);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE relief_requests SET relief_type=?, severity_level=?, district=?, divisional_secretariat=?, gn_division=?, contact_person=?, contact_number=?, address=?, family_members=?, description=? WHERE id=? AND user_id=?");
    $stmt->execute([$relief_type, $severity_level, $district, $divisional_secretariat, $gn_division, $contact_person, $contact_number, $address, intval($family_members), $description, $id, $user['id']]);
    echo json_encode(["success" => true, "message" => "Request updated successfully"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
