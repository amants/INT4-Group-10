-- phpMyAdmin SQL Dump
-- version 4.9.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jun 24, 2020 at 03:23 PM
-- Server version: 5.7.26
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `int4`
--

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

CREATE TABLE `answers` (
  `answer_id` int(11) NOT NULL,
  `answer` varchar(80) NOT NULL,
  `question_id` int(11) NOT NULL,
  `correct` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `answers`
--

INSERT INTO `answers` (`answer_id`, `answer`, `question_id`, `correct`) VALUES
(1, 'Spanish', 1, 1),
(2, 'French', 1, 0),
(3, 'English', 1, 0),
(4, 'German', 1, 0),
(5, 'Camagüey', 2, 0),
(6, 'Santa Clara\r\n', 2, 0),
(7, 'Havana', 2, 1),
(8, 'Kingston', 2, 0),
(9, 'Havana Club', 3, 1),
(10, 'Havana Rum', 3, 0),
(11, 'Havana Bacardi', 3, 0),
(12, 'Havana Latina', 3, 0),
(13, 'Greeting people', 4, 0),
(14, 'Speaking French', 4, 0),
(15, 'Taking pictures of houses and inhabitants', 4, 1),
(16, 'Walking the streets at night', 4, 0),
(17, 'Fidel Castro', 5, 1),
(18, 'Manuel Marrero Cruz', 5, 0),
(19, 'Raúl Castro', 5, 0),
(20, 'Ramiro Valdés', 5, 0),
(21, '.ro', 6, 0),
(22, '.it', 6, 1),
(23, '.il', 6, 0),
(24, '.ae', 6, 0),
(25, '36', 7, 0),
(26, '37', 7, 0),
(27, '38', 7, 0),
(28, '39', 7, 1),
(29, 'Switzerland', 8, 0),
(30, 'France', 8, 1),
(31, 'Germany', 8, 0),
(32, 'Austria', 8, 0),
(33, '40 million', 9, 0),
(34, '48 million', 9, 0),
(35, '60 million', 9, 1),
(36, '69 million', 9, 0),
(37, 'Italy', 10, 1),
(38, 'Greece', 10, 0),
(39, 'Croatia', 10, 0),
(40, 'Spain', 10, 0),
(41, '.ps', 11, 0),
(42, '.pr', 11, 1),
(43, '.pt', 11, 0),
(44, '.po', 11, 0),
(45, 'Coquito', 12, 0),
(46, 'Spiced cherry', 12, 0),
(47, 'Chocolate caliente', 12, 1),
(48, 'Pineapple juice', 12, 0),
(49, 'Grandma', 13, 0),
(50, 'Grammy', 13, 0),
(51, 'Abuela', 13, 1),
(52, 'Grommy', 13, 0),
(53, 'Christmas Eve', 14, 0),
(54, 'December 24th', 14, 0),
(55, 'Noche Buena', 14, 1),
(56, 'Nothing specific', 14, 0),
(57, 'Cuba', 15, 0),
(58, 'Puerto Rico', 15, 1),
(59, 'Venezuela', 15, 0),
(60, 'Colombia', 15, 0),
(81, '.ul', 16, 0),
(82, '.uk', 16, 1),
(83, '.ut', 16, 0),
(84, '.us', 16, 0),
(85, 'Is powerful in the world', 17, 0),
(86, 'Has it\'s own government', 17, 1),
(87, 'Is part of a federation', 17, 0),
(88, 'Non of these answers', 17, 0),
(89, 'British', 18, 1),
(90, 'Brittany', 18, 0),
(91, 'Britton', 18, 0),
(92, 'Brit', 18, 0),
(93, 'Taxi\'s', 19, 0),
(94, 'Public transport', 19, 1),
(95, 'Party busses', 19, 0),
(96, 'Wedding busses', 19, 0),
(97, 'The Netherlands', 20, 0),
(98, 'France', 20, 0),
(99, 'The United Kingdom', 20, 1),
(100, 'Belgium', 20, 0),
(101, '.br', 26, 1),
(102, '.ba', 26, 0),
(103, '.bl', 26, 0),
(104, '.bz', 26, 0),
(105, 'world’s southernmost forest', 27, 0),
(106, 'world’s most biologically diverse habitat', 27, 1),
(107, 'it’s the only place where crocodiles and alligators coexist', 27, 0),
(108, 'All of the above', 27, 0),
(109, 'Samba', 28, 0),
(110, 'Merenque', 28, 0),
(111, 'Bossa Nova', 28, 1),
(112, 'Choro', 28, 0),
(113, 'Grade cuts of pork', 29, 1),
(114, 'seafood stewed in diced tomatoes', 29, 0),
(115, 'a deep-fried patty of crushed black-eyed peas', 29, 0),
(116, 'Beef stew with vegetables', 29, 0),
(117, 'Peru', 30, 0),
(118, 'Brazil', 30, 1),
(119, 'Peru', 30, 0),
(120, 'Bolivia', 30, 0),
(121, 'Bobby', 31, 0),
(122, 'Billy', 31, 0),
(123, 'Buddy', 31, 1),
(124, 'Boutie', 31, 0),
(125, 'Baseball', 32, 0),
(126, 'Basket', 32, 1),
(127, 'Swimming', 32, 0),
(128, 'Soccer', 32, 0),
(129, 'Dime', 33, 1),
(130, 'Penny', 33, 0),
(131, 'Nickel', 33, 0),
(132, 'Cent', 33, 0),
(133, '3.369 liter', 34, 0),
(134, '4.015 liter', 34, 0),
(135, '3.785 liter', 34, 1),
(136, '4.410 liter', 34, 0),
(137, 'Colombia', 35, 0),
(138, 'United States', 35, 1),
(139, 'Mexico', 35, 0),
(140, 'Canada', 35, 0);

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `chat_id` int(11) NOT NULL,
  `lobby_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `time_posted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `chat`
--

INSERT INTO `chat` (`chat_id`, `lobby_id`, `user_id`, `message`, `time_posted`) VALUES
(83, 16, 29, 'message 1', '2020-06-16 14:47:52'),
(84, 16, 29, 'message 2', '2020-06-16 14:47:53'),
(85, 16, 26, 'message 3', '2020-06-16 14:47:55'),
(86, 16, 26, 'message 4', '2020-06-16 14:47:56'),
(87, 16, 26, 'message 5', '2020-06-16 14:48:28'),
(88, 16, 26, 'message 6', '2020-06-16 14:48:30'),
(89, 16, 29, 'message 7', '2020-06-16 14:48:31'),
(90, 16, 29, 'message 8', '2020-06-16 14:48:32'),
(91, 16, 29, 'message 9', '2020-06-16 15:20:44'),
(92, 16, 26, 'message 10', '2020-06-16 15:20:47'),
(93, 16, 26, 'message 11', '2020-06-16 23:20:00'),
(94, 16, 29, 'message 12', '2020-06-16 23:20:03'),
(95, 16, 29, 'message 13', '2020-06-16 23:21:32'),
(96, 16, 26, 'message 14', '2020-06-16 23:21:34'),
(97, 16, 26, 'message 15', '2020-06-16 23:21:34'),
(98, 16, 29, 'message 16', '2020-06-17 01:02:06'),
(99, 16, 29, 'message 17', '2020-06-18 10:01:19'),
(100, 16, 29, 'message 18', '2020-06-18 10:01:20'),
(101, 16, 26, 'message 19', '2020-06-18 10:01:22'),
(102, 16, 26, 'message 20', '2020-06-18 10:01:22'),
(103, 16, 26, 'message 21', '2020-06-19 10:43:26'),
(104, 16, 29, 'message 22', '2020-06-19 13:52:51'),
(105, 16, 29, 'message 23', '2020-06-19 13:52:52'),
(106, 16, 26, 'message 24', '2020-06-19 14:53:36'),
(107, 16, 26, 'message 25', '2020-06-19 14:53:36'),
(108, 16, 26, 'message 26', '2020-06-19 14:53:36'),
(109, 16, 26, 'message 27', '2020-06-19 14:53:38'),
(110, 16, 26, 'message 28', '2020-06-19 14:53:38'),
(111, 16, 26, 'message 29', '2020-06-19 14:53:38'),
(112, 16, 26, 'message 30', '2020-06-19 14:54:01'),
(113, 16, 26, 'message 31', '2020-06-19 14:54:01'),
(114, 16, 26, 'message 32', '2020-06-19 14:55:00'),
(115, 16, 26, 'message 33', '2020-06-19 14:57:11'),
(116, 16, 26, 'message 34', '2020-06-19 14:57:16'),
(117, 16, 26, 'message 35', '2020-06-19 14:57:32'),
(118, 16, 26, 'message 36', '2020-06-19 14:57:34'),
(119, 16, 26, 'message 37', '2020-06-19 14:58:44'),
(120, 16, 26, 'message 38', '2020-06-19 14:58:48'),
(121, 16, 26, 'message 39', '2020-06-19 14:59:41'),
(122, 16, 26, 'message 40', '2020-06-19 14:59:43'),
(123, 16, 26, 'message 41', '2020-06-19 15:06:00'),
(124, 16, 26, 'message 42', '2020-06-19 15:07:07'),
(125, 16, 26, 'message 43', '2020-06-19 15:07:11'),
(126, 16, 26, 'message 44', '2020-06-19 15:08:47'),
(127, 16, 26, 'yo', '2020-06-19 15:09:21'),
(128, 16, 26, 'aaaa', '2020-06-19 15:10:25'),
(129, 16, 26, 'test', '2020-06-19 15:10:31'),
(130, 16, 26, 'top', '2020-06-19 15:10:52'),
(131, 16, 26, 'asdasdfa', '2020-06-19 15:11:31'),
(132, 16, 26, 'asdf', '2020-06-19 15:11:56'),
(133, 16, 26, 'test', '2020-06-19 15:12:09'),
(134, 16, 26, 'test', '2020-06-19 15:12:13'),
(135, 16, 26, 's', '2020-06-19 15:13:03'),
(136, 16, 26, 'a', '2020-06-19 15:14:05'),
(137, 16, 26, 'test', '2020-06-19 15:14:15'),
(138, 16, 26, 'test', '2020-06-19 15:14:56'),
(139, 16, 26, 'wie jij ben', '2020-06-19 15:15:00'),
(140, 16, 26, 'a', '2020-06-19 15:16:09'),
(141, 16, 26, 'F', '2020-06-19 15:16:16'),
(142, 16, 26, 'test', '2020-06-19 15:17:18'),
(143, 16, 26, 'verloren', '2020-06-19 15:17:53'),
(144, 16, 26, 'verloren', '2020-06-19 15:18:01'),
(145, 16, 26, 'te', '2020-06-19 15:18:34'),
(146, 16, 26, 's', '2020-06-19 15:20:11'),
(147, 16, 26, 's', '2020-06-19 15:21:21'),
(148, 16, 26, 'who dis', '2020-06-19 15:21:26'),
(149, 16, 26, 'test', '2020-06-19 15:21:29'),
(150, 19, 31, 'test', '2020-06-19 16:04:13'),
(151, 18, 32, 'yoyo', '2020-06-22 20:14:07'),
(152, 18, 32, 'test', '2020-06-23 23:42:14'),
(153, 24, 31, 'yo', '2020-06-24 00:36:30'),
(154, 18, 31, 're', '2020-06-24 02:26:49');

-- --------------------------------------------------------

--
-- Table structure for table `cocktails`
--

CREATE TABLE `cocktails` (
  `cocktail_id` int(11) NOT NULL,
  `image` text NOT NULL,
  `country_id` int(11) NOT NULL,
  `name` varchar(80) NOT NULL,
  `duration` tinyint(1) NOT NULL,
  `difficulty` tinyint(1) NOT NULL,
  `price` tinyint(1) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `cocktails`
--

INSERT INTO `cocktails` (`cocktail_id`, `image`, `country_id`, `name`, `duration`, `difficulty`, `price`, `active`) VALUES
(1, 'mojito.svg', 1, 'Mojito', 1, 2, 3, 1),
(2, 'strawberry-margherita.svg', 3, 'Strawberry Margarita', 2, 3, 1, 0),
(3, 'pina-colada.svg', 4, 'Piña Colada', 3, 1, 2, 0),
(4, 'bellini.svg', 2, 'Bellini', 3, 2, 3, 1),
(5, 'rum-punch.svg', 6, 'Rum Punch', 3, 2, 3, 0),
(6, 'gin-tonic.svg', 11, 'Gin-Tonic', 3, 2, 3, 0);

-- --------------------------------------------------------

--
-- Table structure for table `cocktail_ingredients`
--

CREATE TABLE `cocktail_ingredients` (
  `ingredient_id` int(11) NOT NULL,
  `cocktail_id` int(11) NOT NULL,
  `name` varchar(80) NOT NULL,
  `amount` int(11) NOT NULL,
  `unit` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `cocktail_ingredients`
--

INSERT INTO `cocktail_ingredients` (`ingredient_id`, `cocktail_id`, `name`, `amount`, `unit`) VALUES
(1, 1, 'Rum', 5, 'cl'),
(2, 1, 'Cane sugar', 1, 'tbsp.'),
(3, 1, 'Crushed ice', 1, ''),
(4, 1, 'Lime juice', 1, 'cl'),
(5, 1, 'Water', 1, ''),
(6, 1, 'Fresh mint leaves', 1, ' handful'),
(7, 4, 'Peach juice', 40, 'ml'),
(8, 4, 'Champagne or prosecco', 80, 'ml'),
(9, 4, 'Peach', 1, 'Your liking'),
(10, 3, 'White rum', 30, 'ml'),
(11, 3, 'Coconut milk', 20, 'ml'),
(12, 3, 'Pineapple juice', 60, 'ml'),
(13, 3, 'Pineapple chunk', 1, 'Optional'),
(14, 5, 'Carta blanca rum', 25, 'ml'),
(15, 5, 'Carta negra rum', 10, 'ml'),
(16, 5, 'Grenadine', 5, 'ml'),
(17, 5, 'Orange juice', 25, 'ml'),
(18, 5, 'Pineapple juice', 25, 'ml'),
(19, 5, 'Lemon slice', 1, 'slice, your liking'),
(24, 6, 'Gin', 45, 'ml'),
(25, 6, 'Tonic', 1, 'bottle'),
(26, 6, 'Lemon', 1, 'slice'),
(27, 6, 'Juniper berries', 1, 'optional'),
(28, 2, 'Tequilla', 45, 'ml'),
(29, 2, 'Triple Sec', 20, 'ml'),
(30, 2, 'Lemon juice', 10, 'ml'),
(31, 2, 'Sugar syrup', 5, 'ml'),
(32, 2, 'Strawberries', 2, 'optional');

-- --------------------------------------------------------

--
-- Table structure for table `cocktail_steps`
--

CREATE TABLE `cocktail_steps` (
  `step_id` int(11) NOT NULL,
  `name` varchar(80) NOT NULL,
  `description` text,
  `step_image` varchar(80) DEFAULT NULL,
  `cocktail_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `cocktail_steps`
--

INSERT INTO `cocktail_steps` (`step_id`, `name`, `description`, `step_image`, `cocktail_id`) VALUES
(1, 'Cocktail step 1', 'Put a few mint leaves and 1cl lime juice in a glass', 'http://via.placeholder.com/150x250', 1),
(2, 'Cocktail step 2', 'Mix 5cl rum with the mint and lime juice', 'http://via.placeholder.com/150x250', 1),
(3, 'Cocktail step 3', 'Add the ice to the glass and top up with soda water\r\n', 'http://via.placeholder.com/150x250', 1),
(4, 'Cocktail step 4', 'Add 1 tbsp. of cane sugar', 'http://via.placeholder.com/150x250', 1),
(5, 'Cocktail step 5', 'Cut a straw in half and add both halves into the cocktail. Et voila! you\'re finished!', 'http://via.placeholder.com/150x250', 1),
(6, 'Peach juice', 'Fill your champagne glass with peach juice', NULL, 4),
(7, 'Prosecco', 'Add the prosecco gradually and fill to the brim of the glass.', NULL, 4),
(8, 'Stir', 'Stir with a bar spoon.', NULL, 4),
(9, 'Garnish', 'Garnish with beautiful peach, which you garnish on the glass like a Venetian feather.', NULL, 4),
(10, 'Enjoy', 'Enjoy your drinks with your buddies!', NULL, 4),
(11, 'Add to shaker', 'Add 60 ml pineapple juice, 20 ml coconut milk and 30 ml rum in a shaker.', NULL, 3),
(12, 'Shake firmly', 'Shake firmly with ice', NULL, 3),
(13, 'Pour the contents', 'Pour the contents of the shaker into a hurricane glass or a pineapple glass. You can also pour the ice into the glass.\r\n', NULL, 3),
(14, 'Garnish', 'Garnish with a fresh piece of pineapple on the glass and a nice red cocktail cherry.', NULL, 3),
(15, 'Enjoy!', 'Enjoy your drinks with your buddies!', NULL, 3),
(16, 'Fill your glass', 'Fill your glass with the grenadine, orange juice and pineapple juice.', NULL, 5),
(17, 'Add the rum', 'Add the carta blanka rum and carta negra rum.', NULL, 5),
(18, 'Stir', 'Stir with a bar spoon.\r\n', NULL, 5),
(19, 'Garnish', 'Garnish with a fresh piece of lemon on the glass.', NULL, 5),
(20, 'Enjoy!', 'Enjoy your drinks with your buddies!', NULL, 5),
(21, 'Fill glass', 'Fill the glass with ice. Preferably use 1 or 2 large ice cubes.', NULL, 6),
(22, 'Pour the gin', 'Pour 45ml of your favorite gin into the glass. Keep 1/4 gin and 3/4 tonic.', NULL, 6),
(23, 'Lemon wedges', 'With a classic tonic you use 1 or 2 wedges of lime or lemon and juniper berries.', NULL, 6),
(24, 'Drain', 'Drain with a qualitative tonic from a small bottle and stir it well.\r\n', NULL, 6),
(25, 'Enjoy!', 'Enjoy your drinks with your buddies!', NULL, 6),
(26, 'Add tequilla', 'Add the tequila, triple sec and lime juice in a shaker.\r\n', NULL, 2),
(27, 'Sugar syrup', 'Add 5ml of sugar syrup', NULL, 2),
(28, 'Strain', 'Use a strainer when pouring into the glass.\r\n', NULL, 2),
(29, 'Garnish', 'Garnish the glass with a nice strawberry.', NULL, 2),
(30, 'Enjoy!', 'Enjoy your drinks with your buddies!', NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `country_id` int(11) NOT NULL,
  `name` varchar(80) NOT NULL,
  `flag_url` varchar(40) NOT NULL,
  `stamp_url` varchar(80) NOT NULL,
  `country_key` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`country_id`, `name`, `flag_url`, `stamp_url`, `country_key`) VALUES
(1, 'Cuba', 'Cuba.png', 'Cuba.png', 'CU'),
(2, 'Italy', 'Italy.png', 'italy.png', 'IT'),
(3, 'United States', 'USA.png', 'usa.png', 'US'),
(4, 'Puerto Rico', 'PR.png', 'puertorico.png', 'PR'),
(5, 'India', 'India.png', '', 'IN'),
(6, 'United Kingdom', 'UK.png', 'england.png', 'UK'),
(7, 'Belgium', 'BE.png', '', 'BE'),
(8, 'France', 'FR.png', '', 'FR'),
(9, 'Germany', 'DE.png', '', 'DE'),
(10, 'The Netherlands', 'NL.png', '', 'NL'),
(11, 'Brazil', 'BR.png', 'brazil.png', 'BR');

-- --------------------------------------------------------

--
-- Table structure for table `lobbies`
--

CREATE TABLE `lobbies` (
  `lobby_id` int(11) NOT NULL,
  `lobby_key` varchar(80) NOT NULL,
  `name` varchar(80) NOT NULL,
  `start_date` timestamp NULL DEFAULT NULL,
  `current_cocktail` tinyint(4) DEFAULT NULL,
  `party_leader` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `lobbies`
--

INSERT INTO `lobbies` (`lobby_id`, `lobby_key`, `name`, `start_date`, `current_cocktail`, `party_leader`) VALUES
(17, 'fe8c2781-27e1-44f1-9fc0-1dd8f82b1304', 'Test party 1 member', '2020-07-15 13:32:00', 4, 31),
(18, '490a79aa-7442-46ce-84a0-55bcc6762102', 'Test party 2 members', '2020-07-15 13:32:00', 1, 31),
(19, 'b9df5e9c-3374-426c-8714-1815b2a9cb81', 'Test party 3 members', '2020-07-15 13:32:00', 1, 31);

-- --------------------------------------------------------

--
-- Table structure for table `lobby_cocktail_photos`
--

CREATE TABLE `lobby_cocktail_photos` (
  `photo_id` int(11) NOT NULL,
  `photo_url` text NOT NULL,
  `lobby_id` int(11) NOT NULL,
  `cocktail_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `time_uploaded` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `lobby_members`
--

CREATE TABLE `lobby_members` (
  `id` int(11) NOT NULL,
  `lobby_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `leader` tinyint(1) NOT NULL,
  `shots` int(11) NOT NULL,
  `score` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `lobby_members`
--

INSERT INTO `lobby_members` (`id`, `lobby_id`, `user_id`, `leader`, `shots`, `score`) VALUES
(30, 17, 31, 1, 9, 2680),
(31, 18, 32, 0, 2, 20),
(32, 18, 31, 1, 1, 60),
(33, 19, 32, 0, 0, 0),
(34, 19, 33, 0, 0, 0),
(35, 19, 31, 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `lobby_unlocked_cocktails`
--

CREATE TABLE `lobby_unlocked_cocktails` (
  `id` int(11) NOT NULL,
  `lobby_id` int(11) NOT NULL,
  `cocktail_id` int(11) NOT NULL,
  `time_unlocked` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `question_id` int(11) NOT NULL,
  `title` varchar(80) NOT NULL,
  `description` text NOT NULL,
  `image` text,
  `cocktail_id` int(11) NOT NULL,
  `final_question` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`question_id`, `title`, `description`, `image`, `cocktail_id`, `final_question`) VALUES
(1, 'What is the official language?', '', 'http://via.placeholder.com/150x250', 1, 0),
(2, 'What\'s the capital of the country we\'re searching?', '', 'http://via.placeholder.com/150x250', 1, 1),
(3, 'What is the most popular rum brand?\r\n', '', 'http://via.placeholder.com/150x250', 1, 0),
(4, 'What is better not to do in this country?', '', 'http://via.placeholder.com/150x250', 1, 0),
(5, 'Who is also called El Gallego?', '', 'http://via.placeholder.com/150x250', 1, 0),
(6, 'What is the country code?', '', NULL, 4, 0),
(7, 'What is the country code?', '', NULL, 4, 0),
(8, 'What are not neighbouring countries?', '', NULL, 4, 0),
(9, 'How many inhabitants are there approximately?', '', NULL, 4, 0),
(10, 'In which country do you think you are?', '', NULL, 4, 1),
(11, 'What is the country code?', '', NULL, 3, 0),
(12, 'Which Christmas drink do they find very important?', '', NULL, 3, 0),
(13, 'What do they call their grandmother?', '', NULL, 3, 0),
(14, 'What do they call the night before Christmas?', '', NULL, 3, 0),
(15, 'In which country do you think you are?', '', NULL, 3, 1),
(16, 'What is the country code?', '', NULL, 5, 0),
(17, 'A \"sovereign country\" is', '', NULL, 5, 0),
(18, 'What passport would a Scottish citizen of the UK normally hold?', '', NULL, 5, 0),
(19, 'What are the red busses for?', '', NULL, 5, 0),
(20, 'In which country do you think you are?\r\n', '', NULL, 5, 1),
(26, 'What is the country code?', '', NULL, 6, 0),
(27, 'This country has a special rainforest that:', '', NULL, 6, 0),
(28, 'What is the genre of the popular 1960s song \"The Girl From Ipanema”?', '', NULL, 6, 0),
(29, 'The national dish is feijoada, but what is it exactly?', '', NULL, 6, 0),
(30, 'In which country do you think you are?', '', NULL, 6, 1),
(31, 'What was Bill Clinton\'s dog\'s name, a brown labrador, that he got in 1997?', '', NULL, 2, 0),
(32, 'What is Barack Obama\'s favorite sport?\r\n', '', NULL, 2, 0),
(33, 'How do they call 10 cents', '', NULL, 2, 0),
(34, 'How many liters does 1 gallon correspond to?', '', NULL, 2, 0),
(35, 'In which country do you think you are?', '', NULL, 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `joined` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `avatar` varchar(255) DEFAULT NULL,
  `refresh_token` text,
  `salt` varchar(255) DEFAULT NULL,
  `country_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `username`, `password`, `email`, `joined`, `avatar`, `refresh_token`, `salt`, `country_id`) VALUES
(31, 'test1', '$2b$10$Tc0m8xjK.SF5UL59bnqdr.DLH.zM/AMgA7zhZdHTEMEvPa/YmiDbq', 'test1@howest.be', '2020-06-19 15:15:44', NULL, 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QxIiwiZW1haWwiOiJ0ZXN0MUBob3dlc3QuYmUiLCJpYXQiOjE1OTI1NzI1NDQsImF1ZCI6Imh0dHBzOi8vaW50NC5uZW9sb2wuY29tIiwiaXNzIjoiSW50ZWdyYXRpb24iLCJzdWIiOiJ0ZXN0MSJ9.dijzy6rlJQr7SFEVg0WN12CuSpc2vsDE23NFB8SYzO-UB74Ge11LD3koY-d9qWslX49H7zwmGBSZuFtjM3BHFQ', '$2b$10$Tc0m8xjK.SF5UL59bnqdr.', 5),
(32, 'test2', '$2b$10$KEYcOD9U7qaCn2FZyBYwjeKNgimxQ8ENKPW5UtLVb204nry32TJOq', 'test2@howest.be', '2020-06-19 15:15:56', NULL, 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QyIiwiZW1haWwiOiJ0ZXN0MkBob3dlc3QuYmUiLCJpYXQiOjE1OTI1NzI1NTYsImF1ZCI6Imh0dHBzOi8vaW50NC5uZW9sb2wuY29tIiwiaXNzIjoiSW50ZWdyYXRpb24iLCJzdWIiOiJ0ZXN0MiJ9.PfgcdkJC-4qi1CMmu2dfCO3KEqTB02fjKUTLXH7rPKsL2NBhB0gAGph3AoiZcrTEfgymOFwBn07MMCJyJng1bQ', '$2b$10$KEYcOD9U7qaCn2FZyBYwje', 1),
(33, 'test3', '$2b$10$9V7lFHItcuxpsNm65ZHyBujnUFeTsQfkmK4byWtZ1LykqtOyc8TL.', 'test3@howest.be', '2020-06-19 15:16:09', NULL, 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QzIiwiZW1haWwiOiJ0ZXN0M0Bob3dlc3QuYmUiLCJpYXQiOjE1OTI1NzI1NjksImF1ZCI6Imh0dHBzOi8vaW50NC5uZW9sb2wuY29tIiwiaXNzIjoiSW50ZWdyYXRpb24iLCJzdWIiOiJ0ZXN0MyJ9.0V4_e5rS7QpA2Y9h0tWmMSMdEXgQk4QbJgMo5fPhrrcVb9GW_l-ki4mlgJIlqFT8cq87UlHnTa-MD_4vP903rA', '$2b$10$9V7lFHItcuxpsNm65ZHyBu', 2);

-- --------------------------------------------------------

--
-- Table structure for table `user_cocktail_photos`
--

CREATE TABLE `user_cocktail_photos` (
  `photo_id` int(11) NOT NULL,
  `photo_url` text NOT NULL,
  `cocktail_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `time_uploaded` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_cocktail_photos`
--

INSERT INTO `user_cocktail_photos` (`photo_id`, `photo_url`, `cocktail_id`, `user_id`, `time_uploaded`) VALUES
(29, '25-4-36.jpg', 4, 36, '2020-06-24 14:35:08');

-- --------------------------------------------------------

--
-- Table structure for table `user_unlocked_cocktails`
--

CREATE TABLE `user_unlocked_cocktails` (
  `id` int(11) NOT NULL,
  `cocktail_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `time_unlocked` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`answer_id`);

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`chat_id`);

--
-- Indexes for table `cocktails`
--
ALTER TABLE `cocktails`
  ADD PRIMARY KEY (`cocktail_id`);

--
-- Indexes for table `cocktail_ingredients`
--
ALTER TABLE `cocktail_ingredients`
  ADD PRIMARY KEY (`ingredient_id`);

--
-- Indexes for table `cocktail_steps`
--
ALTER TABLE `cocktail_steps`
  ADD PRIMARY KEY (`step_id`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`country_id`);

--
-- Indexes for table `lobbies`
--
ALTER TABLE `lobbies`
  ADD PRIMARY KEY (`lobby_id`);

--
-- Indexes for table `lobby_cocktail_photos`
--
ALTER TABLE `lobby_cocktail_photos`
  ADD PRIMARY KEY (`photo_id`);

--
-- Indexes for table `lobby_members`
--
ALTER TABLE `lobby_members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lobby_unlocked_cocktails`
--
ALTER TABLE `lobby_unlocked_cocktails`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`question_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_cocktail_photos`
--
ALTER TABLE `user_cocktail_photos`
  ADD PRIMARY KEY (`photo_id`);

--
-- Indexes for table `user_unlocked_cocktails`
--
ALTER TABLE `user_unlocked_cocktails`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `chat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;

--
-- AUTO_INCREMENT for table `cocktails`
--
ALTER TABLE `cocktails`
  MODIFY `cocktail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `cocktail_ingredients`
--
ALTER TABLE `cocktail_ingredients`
  MODIFY `ingredient_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `cocktail_steps`
--
ALTER TABLE `cocktail_steps`
  MODIFY `step_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `country_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `lobbies`
--
ALTER TABLE `lobbies`
  MODIFY `lobby_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `lobby_cocktail_photos`
--
ALTER TABLE `lobby_cocktail_photos`
  MODIFY `photo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `lobby_members`
--
ALTER TABLE `lobby_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `lobby_unlocked_cocktails`
--
ALTER TABLE `lobby_unlocked_cocktails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `user_cocktail_photos`
--
ALTER TABLE `user_cocktail_photos`
  MODIFY `photo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `user_unlocked_cocktails`
--
ALTER TABLE `user_unlocked_cocktails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
