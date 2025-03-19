import UserDTO from '../dto/userDTO.js';
import { generateToken } from '../utils/jwtUtils.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';

class UserController {
  constructor() {
    this.userRepository = UserRepository;
  }

  handleErrorResponse(res, message, error, statusCode = 500) {
    console.error(message, error);
    return res.status(statusCode).json({ message, error: error.message || error });
  }

  async register(req, res) {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
      const existingUser = await this.userRepository.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'El email ya está registrado' });
      }

      const hashedPassword = await hashPassword(password);
      const newUser = await this.userRepository.registerUser({
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
        role: 'user',
      });

      res.status(201).json({ message: 'Usuario creado con éxito', user: newUser });
    } catch (error) {
      this.handleErrorResponse(res, 'Error creando usuario:', error);
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    try {
      const user = await this.userRepository.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const token = generateToken(user);

      res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
      this.handleErrorResponse(res, 'Error iniciando sesión:', error);
    }
  }

  async currentUser(req, res) {
    try {
      const user = await this.userRepository.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const userDTO = new UserDTO(user);
      res.status(200).json({ user: userDTO });
    } catch (error) {
      this.handleErrorResponse(res, 'Error obteniendo datos del usuario:', error);
    }
  }
}

export default UserController;