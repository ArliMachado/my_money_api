const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./user');
const env = require('../../.env');

const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/;

const sendErrorsFromDB = (res, dbErrors) => {
  const errors = [];
  _.forIn(dbErrors.errors, error => errors.push(error.message));
  return res.status(400).json({ errors });
};


const login = (req, res) => {
  const email = req.body.email || '';
  const password = req.body.password || '';

  User.findOne({ email }, (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err);
    }

    console.log(user);

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(user, env.authSecret, { expiresIn: '1 day' });
      const { name, email } = user;
      return res.json({ name, email, token });
    }

    return res.status(400).send({ errors: ['Usuário/Senha inválidos'] });
  });
};

const validateToken = (req, res) => {
  const token = req.body.token || '';

  jwt.verify(token, env.authSecret, (err) => {
    return res.status(200).send({ valid: !err });
  });
};


const signup = (req, res, next) => {
  const name = req.body.name || '';
  const email = req.body.email || '';
  const password = req.body.password || '';
  const confirmPassword = req.body.confirm_password || '';

  if (!email.match(emailRegex)) {
    return res.status(400).send({ errors: ['O e-mail informa está inválido'] });
  }

  if (!password.match(passwordRegex)) {
    return res.status(400).send({
      errors: [
        'Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@#$ %) e tamanho entre 6 - 20.'
      ],
    });
  }

  const salt = bcrypt.genSaltSync();
  const passwordHash = bcrypt.hashSync(password, salt);

  if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
    return res.status(400).send({ errors: ['Senhas não conferem.'] });
  }

  User.findOne({ email }, (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err);
    }

    if (user) {
      return res.status(400).send({ errors: ['Usuário já cadastrado.'] });
    }

    const newUser = new User({ name, email, password: passwordHash });
    newUser.save((error) => {
      if (error) {
        return sendErrorsFromDB(res, error);
      }

      login(req, res, next);
    });
  });
};

module.exports = { login, signup, validateToken };
