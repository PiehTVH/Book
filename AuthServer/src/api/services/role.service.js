const Role = require("../models/role.model");

// Define the Role service
class RoleService {
  async createRole(name, description) {
    return await Role.create({ name, description });
  }

  async getAllRoles() {
    return await Role.findAll();
  }

  async getRoleById(id) {
    return await Role.findByPk(id);
  }

  async getRoleByName(name) {
    return await Role.findOne({ where: { name } });
  }

  async updateRole(id, name, description) {
    return await Role.update({ name, description }, { where: { id } });
  }

  async deleteRole(id) {
    return await Role.destroy({ where: { id } });
  }
}

exports.roleService = new RoleService();
