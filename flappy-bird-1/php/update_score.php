<?php
$data = json_decode(file_get_contents('php://input'), true);
echo json_encode([
    'message' => $data['score']
]);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "flappy_bird";

$response = array('success' => false, 'message' => '');

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    $response['message'] = "Connection failed: " . $conn->connect_error;
    echo json_encode($response);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    $response['message'] = "User not logged in";
    echo json_encode($response);
    exit();
} else {
    echo "User ID: " . $_SESSION['user_id'];
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['score'])) {
    $user_id = $_SESSION['user_id'];
    $new_score = intval($_POST['score']);
    echo "Received score: " . $new_score;
    
    $query = "SELECT score FROM users WHERE user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $current_score = 0;

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $current_score = intval($row['score']);
    }

    if ($new_score > $current_score) {
        $update_query = "UPDATE users SET score = ? WHERE user_id = ?";
        $stmt = $conn->prepare($update_query);
        $stmt->bind_param("ii", $new_score, $user_id);
        
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = "Score updated successfully";
        } else {
            $response['message'] = "Error updating score: " . $stmt->error;
        }
    } else {
        $response['message'] = "New score is not higher than current record";
    }
    echo json_encode($response);
} else {
    $response['message'] = "Invalid request or missing score";
    echo json_encode($response);
}

$conn->close();
