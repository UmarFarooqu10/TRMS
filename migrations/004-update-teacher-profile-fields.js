export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("teachers", "name", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("teachers", "education", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.changeColumn("teachers", "courses", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn("teachers", "department", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("teachers", "name");
    await queryInterface.changeColumn("teachers", "education", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("teachers", "courses", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.removeColumn("teachers", "department");
  },
};
