'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true,
        autoIncrement: true,
      },
      usertelegramId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
        // unique: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      farmedPoints: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      walletAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '/assets/default.jpg'
      },
      referralLink: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      completedTasks: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      numberofReferrals: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      migrationCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mintedNft: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateCreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};