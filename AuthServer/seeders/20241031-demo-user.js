"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const currentDate = new Date();
    await queryInterface.bulkInsert("roles", [
      { name: "user", createdAt: currentDate, updatedAt: currentDate },
      { name: "admin", createdAt: currentDate, updatedAt: currentDate },
    ]);
    // what is the password for all the users? "password"
    // bcrypt.hash("password", 10, (err, hash) => console.log(hash));
    await queryInterface.bulkInsert("users", [
      {
        username: "user1",
        password:
          "$2a$10$F2F3oZyfGZn8jvR5v7kU7e3K6Qf0D6JzYw3Pb3j3qZz1P1z6O5l7S",
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        username: "user2",
        password:
          "$2a$10$F2F3oZyfGZn8jvR5v7kU7e3K6Qf0D6JzYw3Pb3j3qZz1P1z6O5l7S",
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        username: "user3",
        password:
          "$2a$10$F2F3oZyfGZn8jvR5v7kU7e3K6Qf0D6JzYw3Pb3j3qZz1P1z6O5l7S",
        createdAt: currentDate,
        updatedAt: currentDate,
      },
      {
        username: "user4",
        password:
          "$2a$10$F2F3oZyfGZn8jvR5v7kU7e3K6Qf0D6JzYw3Pb3j3qZz1P1z6O5l7S",
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    ]);
    await queryInterface.bulkInsert("user_roles", [
      { userId: 1, roleId: 1, createdAt: currentDate, updatedAt: currentDate },
      { userId: 2, roleId: 1, createdAt: currentDate, updatedAt: currentDate },
      { userId: 3, roleId: 2, createdAt: currentDate, updatedAt: currentDate },
      { userId: 4, roleId: 2, createdAt: currentDate, updatedAt: currentDate },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
