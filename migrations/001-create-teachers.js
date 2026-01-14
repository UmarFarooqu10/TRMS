export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("teachers", {
      id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.BIGINT, unique: true },
      education: Sequelize.STRING,
      courses: Sequelize.STRING,
      experienceYears: Sequelize.INTEGER,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("teachers");
  },
};
