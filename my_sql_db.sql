--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `roleId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `userId`, `roleId`, `createdAt`, `updatedAt`) VALUES 
(1, 1, 1, '2024-11-02 09:02:30', '2024-11-02 09:02:30'),
(2, 2, 1, '2024-11-02 09:02:30', '2024-11-02 09:02:30'),
(4, 4, 2, '2024-11-02 09:02:30', '2024-11-02 09:02:30'),
(5, 1, 2, '2024-11-02 09:19:40', '2024-11-02 09:19:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user_roles`
--

ALTER TABLE `user_roles`
    ADD PRIMARY KEY (`id`),
    ADD KEY `userId` (`userId`),
    ADD KEY `roleId` (`roleId`);

--
-- AUTO_INCREMENT for table `user_roles`
--

ALTER TABLE `user_roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for table `user_roles`
--

ALTER TABLE `user_roles`
    ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`)