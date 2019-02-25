const BillingCycle = require('./billingCycle');
const errosHandler = require('../common/errorHandler');

BillingCycle.methods(['get', 'post', 'put', 'delete']);
BillingCycle.updateOptions({ new: true, runValidator: true });
BillingCycle
  .after('post', errosHandler)
  .after('put', errosHandler);

BillingCycle.route('count', (req, res) => {
  BillingCycle.count((error, value) => {
    if (error) {
      res.status(500).json({ errors: [error] });
    } else {
      res.json({ value });
    }
  });
});

BillingCycle.route('summary', (req, res) => {
  BillingCycle.aggregate(
    { $project: { credit: { $sum: '$credits.value' }, debt: { $sum: '$debts.value' } } },
    { $group: { _id: null, credit: { $sum: '$credit' }, debt: { $sum: '$debt' } } },
    { $project: { _id: 0, credit: 1, debt: 1 } },
    (error, result) => {
      if (error) {
        res.status(500).json({ errors: [error] });
      } else {
        res.json(result[0] || { credit: 0, debt: 0 });
      }
    },
  );
});

module.exports = BillingCycle;
