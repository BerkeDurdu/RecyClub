const AuthService = require('../../domain/services/AuthService');
const { User } = require('../../resource/models');
const { pickUser, require_ } = require('../../common/dto');

async function register(req, res, next) {
  try {
    require_(req.body, ['name', 'email', 'password']);
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (e) { next(e); }
}

async function login(req, res, next) {
  try {
    require_(req.body, ['email', 'password']);
    const result = await AuthService.login(req.body);
    res.json(result);
  } catch (e) { next(e); }
}

async function me(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ user: pickUser(user) });
  } catch (e) { next(e); }
}

module.exports = { register, login, me };
