const { roleService } = require("../services/role.service");

class RoleController {
  async createRole(req, res) {
    try {
      const { name, description } = req.body;
      const role = await roleService.createRole(name, description);
      res.status(201).json(role);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllRoles(req, res) {
    try {
      const roles = await roleService.getAllRoles();
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getRoleById(req, res) {
    try {
      const { id } = req.params;
      const role = await roleService.getRoleById(id);
      if (role) {
        res.status(200).json(role);
      } else {
        res.status(404).json({ message: "Role not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const updated = await roleService.updateRole(id, name, description);
      if (updated[0] > 0) {
        res.status(200).json({ message: "Role updated successfully" });
      } else {
        res.status(404).json({ message: "Role not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteRole(req, res) {
    try {
      const { id } = req.params;
      const deleted = await roleService.deleteRole(id);
      if (deleted > 0) {
        res.status(200).json({ message: "Role deleted successfully" });
      } else {
        res.status(404).json({ message: "Role not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new RoleController(); // Export an instance of the controller
