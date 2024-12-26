<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flappy Bird - Главная</title>
    <link rel="stylesheet" href="стили/flappybird.css">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(to right, #00c6ff, #0072ff);
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
            color: #fff;
        }
        h1 {
            font-size: 4em;
            margin-bottom: 0.5em;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        p {
            font-size: 1.5em;
            max-width: 700px;
            margin-bottom: 1.5em;
            line-height: 1.6;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }
        a, button {
            display: inline-block;
            margin: 0.5em;
            padding: 0.8em 1.5em;
            font-size: 1.2em;
            color: white;
            background-color: #ff5722;
            border: none;
            border-radius: 25px;
            text-decoration: none;
            transition: background-color 0.3s ease, transform 0.3s ease;
        }
        a:hover, button:hover {
            background-color: #e64a19;
            transform: scale(1.05);
        }
        button {
            cursor: pointer;
        }
    </style>
</head>
<body>
    <h1>Flappy Bird</h1>
    <p>Погрузитесь в мир Flappy Bird, где ваша задача — провести маленькую птичку через опасные трубы. Это испытание на ловкость и терпение, которое захватывает с первых секунд!</p>
    <p style="border: 2px solid #ff9999; padding: 15px; border-radius: 8px; background-color: #ffe6e6; font-family: Arial, sans-serif; font-size: 18px; color: black;"><strong>Правила игры:</strong> Используйте пробел или клики мыши, чтобы поддерживать птицу в полете. Избегайте столкновений с трубами и постарайтесь набрать как можно больше очков! Через каждые 100 очков сложность игры будет увеличиваться!</p>
    <div>
        <a href="php/lider_bord.php">Таблица лидеров</a>
        <a href="php/register.php">Регистрация</a>
        <a href="php/login.php">Войти</a>
        <button onclick="startGame()">Играть</button>
    </div>
    <script>
        function startGame() {
            // Проверяем, авторизован ли пользователь
            const isAuthenticated = <?php echo isset($_SESSION['user_id']) ? 'true' : 'false'; ?>;
            if (isAuthenticated) {
                window.location.href = 'php/game.php';
            } else {
                window.location.href = 'php/login.php';
            }
        }
    </script>
</body>
</html>
