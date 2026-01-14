export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reviews", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      studentId: Sequelize.BIGINT,
      teacherId: Sequelize.BIGINT,
      rating: Sequelize.INTEGER,
      comment: Sequelize.TEXT,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    await queryInterface.addConstraint("reviews", {
      fields: ["studentId", "teacherId"],
      type: "unique",
      name: "unique_student_teacher_review",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("reviews");
  },
};