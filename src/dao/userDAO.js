import User from '../models/user.model.js';

class UserDAO {
  async createUser(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw new Error('Error al crear usuario');
    }
  }

  async findUserByEmail(email) {
    try {
      return await User.findOne({ email }).lean();
    } catch (error) {
      console.error('Error buscando usuario por email:', error);
      throw new Error('Error al buscar usuario');
    }
  }

  async findUserById(id) {
    try {
      return await User.findById(id).lean();
    } catch (error) {
      console.error('Error buscando usuario por ID:', error);
      throw new Error('Error al buscar usuario');
    }
  }

  async updateUser(id, updateData) {
    try {
      return await User.findByIdAndUpdate(id, updateData, { new: true }).lean();
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw new Error('Error al actualizar usuario');
    }
  }

  async deleteUser(id) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw new Error('Error al eliminar usuario');
    }
  }
}

export default new UserDAO();
