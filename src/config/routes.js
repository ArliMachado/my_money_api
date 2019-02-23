const express = require('express');
const BillingCycle = require('../api/billingCycle/billingCycleService');

module.exports = (server) => {
  const router = express.Router();
  server.use('/api', router);

  BillingCycle.register(router, '/billingCycles');
};
