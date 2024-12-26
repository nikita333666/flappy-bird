<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Регистрация</title>
    <link rel="stylesheet" href="../стили/flappybird.css">
</head>
<body>
    <?php
    // Проверяем, если пользователь зашел по определенной ссылке, перенаправляем на главную страницу
    if (isset($_GET['redirect']) && $_GET['redirect'] == 'home') {
        header('Location: ./index.php');
        exit();
    }

    $errors = [];
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "flappy_bird";

        $conn = new mysqli($servername, $username, $password, $dbname);
        if ($conn->connect_error) {
            die("Ошибка подключения: " . $conn->connect_error);
        }

        $login = $_POST['login'];
        $password = $_POST['password'];
        $confirm_password = $_POST['confirm_password'];
        $nickname = $_POST['nickname'];

        $checkLoginQuery = "SELECT * FROM users WHERE login='$login'";
        $resultLogin = $conn->query($checkLoginQuery);
        if ($resultLogin->num_rows > 0) {
            $errors[] = "Пользователь под таким логином уже существует.";
        }

        $checkNicknameQuery = "SELECT * FROM users WHERE nickname='$nickname'";
        $resultNickname = $conn->query($checkNicknameQuery);
        if ($resultNickname->num_rows > 0) {
            $errors[] = "Пользователь под таким никнеймом уже существует.";
        }

        if ($password !== $confirm_password) {
            $errors[] = "Пароли не совпадают.";
        }
        if (strlen($password) < 8) {
            $errors[] = "Пароль должен содержать минимум 8 символов.";
        }

        if (empty($errors)) {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $insertQuery = "INSERT INTO users (login, password, nickname) VALUES ('$login', '$hashedPassword', '$nickname')";

            if ($conn->query($insertQuery) === TRUE) {
                header("Location: login.php");
                exit();
            } else {
                $errors[] = "Ошибка: " . $conn->error;
            }
        }

        $conn->close();
    }
    ?>
    <div class="registration-form">
        <h2>Регистрация</h2>
        <?php if (!empty($errors)): ?>
            <div class="error">
                <?php foreach ($errors as $error): ?>
                    <?php echo htmlspecialchars($error); ?><br>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        <form action="" method="post">
            <label for="login">Логин:</label>
            <input type="text" id="login" name="login" required>

            <label for="password">Пароль:</label>
            <input type="password" id="password" name="password" required>

            <label for="confirm_password">Подтверждение пароля:</label>
            <input type="password" id="confirm_password" name="confirm_password" required>

            <label for="nickname">Никнейм:</label>
            <input type="text" id="nickname" name="nickname" required>

            <button type="submit">Зарегистрироваться</button>
        </form>
        <a href="login.php">У вас уже есть аккаунт? Войти</a>
    </div>
</body>
</html>
