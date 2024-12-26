<?php
session_start();

// Проверяем, если пользователь зашел по определенной ссылке, перенаправляем на главную страницу
if (isset($_GET['redirect']) && $_GET['redirect'] == 'home') {
    header('Location: ./index.php');
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "flappy_bird";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Ошибка подключения: " . $conn->connect_error);
}

$errors = [];
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $login = $_POST['login'];
    $password = $_POST['password'];
    $query = "SELECT * FROM users WHERE login='$login'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['nickname'] = $user['nickname'];
            $_SESSION['login'] = $user['login'];
            header("Location: ./game.php");
            exit();
        } else {
            $errors[] = "Неверный логин или пароль.";
        }
    } else {
        $errors[] = "Неверный логин или пароль.";
    }
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вход</title>
    <link rel="stylesheet" href="../стили/flappybird.css">
</head>
<body>
    <div class="login-form">
        <h2>Вход</h2>
        <?php if (!empty($errors)): ?>
            <div class="error">
                <?php foreach ($errors as $error): ?>
                    <?php echo htmlspecialchars($error); ?><br>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        <form action="login.php" method="post">
            <label for="login">Логин:</label>
            <input type="text" id="login" name="login" required>
            <label for="password">Пароль:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Войти</button>
        </form>
        <a href="register.php" id="register-link">Нет аккаунта? Зарегистрироваться</a>
    </div>
    <script>
            document.getElementById('register-link').addEventListener('click', function(event) {
                event.preventDefault();
                window.location.href = 'register.php'; 
            });
        </script>
</body>
</html>