import bcrypt from "bcrypt";

export default {
    async up(queryInterface) {
        const hash = await bcrypt.hash("Admin@123", 12);

        await queryInterface.bulkInsert("users", [
            {
                email: "admin@trms.com",
                passwordHash: hash,
                role: "ADMIN",
                status: "ACTIVE",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete("users", { email: "admin@trms.com" });
    },
};
