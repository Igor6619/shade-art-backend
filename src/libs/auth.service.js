import jwt from 'jsonwebtoken';
import User from '#models/User.js';

export class AuthService {
  static #generateToken(user) {
    const payload = { _id: user._id, role: user.role, fullname:user.profile.fullname};
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });
  };
  // Публичный метод: принимает login/password, возвращает { token, user } или бросает ошибку
  static async login(login, password) {
    if (!login || !password) {
      throw new Error('LOGIN и PASSWORD обязательны!');
    }

    const user = await User.findOne({ login })
                          .select('+password')  // Только здесь явно включаем пароль
                          .populate('profile','name patronymic')
                          .exec();
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Неправильный LOGIN или PASSWORD');
    }

    const token =AuthService.#generateToken(user);
    return { token, user };
  }
  
}