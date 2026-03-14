<?php
include 'db.php';
include 'helpers.php';

requireAdmin($pdo);

// Get filters
$district    = $_GET['district'] ?? '';
$relief_type = $_GET['relief_type'] ?? '';




?>