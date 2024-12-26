<?php
session_start();


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
    <title>Таблица лидеров</title>
    <link rel="stylesheet" href="../стили/flappybird.css">
</head>
<body>
    <div id="leaderboard" class="leaderboard" style="margin-top: 20px;">
        <h2>Таблица лидеров</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="padding: 10px; border: 1px solid #ddd;">Место</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Ник</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Очки</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($leaderboard as $index => $player): ?>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;"> <?= $index + 1 ?> </td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;"> <?= htmlspecialchars($player['nickname']) ?> </td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;"> <?= $player['score'] ?> </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</body>
</html>
