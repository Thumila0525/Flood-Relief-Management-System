<?php
include 'db.php';
include 'helpers.php';

requireAdmin($pdo);

$stmt = $pdo->query("SELECT id, full_name, email, phone, nic, address FROM users WHERE role = 'user' ORDER BY created_at DESC");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);


?>