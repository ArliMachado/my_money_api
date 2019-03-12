const express = require('express');
const BillingCycle = require('../api/billingCycle/billingCycleService');
const auth = require('./auth');

const AuthService = require('../api/user/authService');

module.exports = (server) => {

  /*
  * Rotas protegidas por Token JWT
  */
  const protectedApi = express.Router();
  server.use('/api', protectedApi);

  protectedApi.use(auth);

  BillingCycle.register(protectedApi, '/billingCycles');

  /*
  * Rotas abertas
  */

  const openApi = express.Router();
  server.use('/oapi', openApi);
  openApi.post('/login', AuthService.login);
  openApi.post('/signup', AuthService.signup);
};
