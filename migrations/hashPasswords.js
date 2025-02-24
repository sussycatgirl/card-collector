const User = require("../models/user");
const argon2 = require("argon2");

module.exports.exec = async function() {
    for await (const user of User.find({ passwordMigrated: { $ne: true } })) {
        console.info(`Hashing plain-text password for user ${user.username}`);
        user.password = await argon2.hash(user.password);
        user.passwordMigrated = true;
        user.save();
    }
}
