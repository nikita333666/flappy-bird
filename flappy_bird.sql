-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Дек 26 2024 г., 17:06
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `flappy_bird`
--

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `score` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`user_id`, `login`, `password`, `nickname`, `score`) VALUES
(1, 'bebe1', '$2y$10$qROS6/Du2b9GR6eH9g86VeA8FDjhqNYkM0yZsfQ6I6du8LzQXYP22', 'kaban1', 102),
(2, 'bebeb2', '$2y$10$.oqAFi219ZumCcSbcdRoPu1as8yKWdp.aj4vwGz1lsyi/Bh8NlF2G', 'bebebebbebe', 0),
(3, 'hhhhh', '$2y$10$f2hnqfqOlFZ6TOO0ZcaSu.7xgSWxagaao4p.13E4LrYrkWXzxTiEK', 'zzzz', 0),
(4, 'user1', '$2y$10$902FFJP3A4vFTXiTJF9KjOtMDDSO7t9.eJmAB3X3OTxHvpzS3opva', 'byba', 101),
(5, 'uuuuuu', '$2y$10$LJIErwi96BhLMtmkZXqCb.gR8mX26nJtTxKLQyqXdRcxH/u8LmPUa', 'wwww', 0),
(6, 'qqqqq', '$2y$10$oQxceeHppLLIOPM15ROx/.CUgZMyelRoLH.rRj5RQQwSQx1ueRkZ.', 'zzzzzzzz', 0),
(7, 'user333', '$2y$10$CmtfnVmQERmiK8nzjen6vem1bODTaCbrTMGUyFKHmYJ45ApRRuMgG', 'kaab231', 25),
(8, 'zaza', '$2y$10$/92aZ5V//x2jUqYfHCHGZOBlrCj7n8q9rlngHT/7B9T4IzrhLcmwa', 'biba', 13),
(9, 'easfgawfg', '$2y$10$0f7rXMENI0WyCR8RdM/Eu.LFrOJZ71NEO9TqtDsOk6sA0Ionb0qja', 'ZET', 14);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `login` (`login`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
