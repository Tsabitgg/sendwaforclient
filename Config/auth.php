<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
require 'db.php';


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Username and password are required']);
        exit;
    }

    $conn = getDbConnection('localhost', 'root', 'Smartpay1ct', 'sendwa');
    // $conn = getDbConnection('localhost', 'root', '', 'apiwa');

    // Ambil data user berdasarkan username
    $stmt = $conn->prepare("SELECT * FROM master_setting WHERE username = ?");
    if ($stmt === false) {
        error_log("Failed to prepare statement: " . $conn->error);
        echo json_encode(['success' => false, 'message' => 'Database error']);
        exit;
    }

    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $userData = $result->fetch_assoc();
        $storedPassword = $userData['password'];

        // Cek apakah password di-hash atau tidak
        $isPasswordVerified = password_verify($password, $storedPassword) || $password === $storedPassword;

        if ($isPasswordVerified) {
            session_regenerate_id(true); // Menghindari session fixation
            $_SESSION['logged_in'] = true;
            $_SESSION['user_data'] = $userData;
            
            // Cek role pengguna
            if ($userData['roles'] === 'Client') {
                echo json_encode(['success' => true, 'roles' => 'Client']);
            } elseif ($userData['roles'] === 'admin') {
                echo json_encode(['success' => true, 'roles' => 'admin']);
            } else {
                error_log("User role is not 'Client' or 'admin': $username");
                echo json_encode(['success' => false, 'message' => 'Access denied']);
            }
        } else {
            error_log("Password verification failed for username: $username");
            echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
        }
    } else {
        error_log("Invalid username: $username");
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    }

    $stmt->close();
    $conn->close();
} else {
    header('Location: login.php');
    exit;
}

?>
