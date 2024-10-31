const User = require("./user.model");
const Role = require("./role.model");

// Define the association with Role model
User.belongsToMany(Role, { through: "user_roles" });
Role.belongsToMany(User, { through: "user_roles" });
