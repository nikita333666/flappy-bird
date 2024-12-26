<?php
session_start();

// Проверяем, если пользователь зашел по определенной ссылке, перенаправляем на главную страницу
if (isset($_GET['redirect']) && $_GET['redirect'] == 'home') {
    header('Location: ./glav.php');
    exit();
}

if (!isset($_SESSION['user_id'])) {
    header("Location: register.php");
    exit();
}

$servername = "localhost";
$username = "root";
$password = ""; 
$dbname = "flappy_bird";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT nickname, score FROM users ORDER BY score DESC LIMIT 15";
$result = $conn->query($sql);

$leaderboard = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $leaderboard[] = $row;
    }
}
$conn->close();
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flappy Bird</title>
    <link rel="icon" href="data:,">
    <link rel="stylesheet" href="../стили/flappybird.css">
    <style>
        .pause-instruction {
            position: absolute;
            left: 20px;
            top: 100px;
            color: #f0f0f0;
            font-size: 18px;
            background-color: rgba(0, 0, 0, 0.7);
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            line-height: 1.5;
            max-width: 200px;
            text-align: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: none;
        }
        .pause-button {
            position: absolute;
            top: 20px;
            left: 20px;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            display: none;
        }
        .pause-button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
        <div class="user-info" style="position: absolute; top: 10px; right: 10px;">
            <span>Логин: <?php echo isset($_SESSION['login']) ? $_SESSION['login'] : 'Неизвестный пользователь'; ?></span>
            <form action="logout.php" method="post" style="display:inline;">
                <button type="submit">Выйти</button>
            </form>
        </div>
        <canvas id="board"></canvas>
    </div>
    <script src="../скрипты/flappybird.js"></script>
</body>
</html>
