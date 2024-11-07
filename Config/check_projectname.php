<?php
session_start();
require 'db.php';

if (!isset($_SESSION['logged_in'])) {
    header('Location: login.php');
    exit();
}

$userData = $_SESSION['user_data'];
$username = $userData['username'];
$projectName = $userData['project_name'];

$conn = getDbConnection($userData['host'], $userData['userdb'], $userData['passdb'], $userData['dbname']);
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['project-name'])) {
    $projectNameAd = trim($_POST['project-name']);

    $query = "SELECT COUNT(*) AS count FROM master_setting WHERE project_name = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $projectNameAd);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();

   // Mengembalikan hasilnya sebagai JSON
   echo json_encode(['exists' => $count > 0]);
}
?>