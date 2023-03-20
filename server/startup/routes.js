const payments = require('../routes/payments');
const crypto = require('../routes/crypto');
const goldPrice = require('../routes/goldPrice');
const {web3elements} = require('./web3');

module.exports = function (app, express) {
    app.use(express.json());

    app.use(web3elements);

    app.get('/', (req, res) => {
        res.send(welcome);
    });

    app.use('/payments', payments);

    app.use('/crypto', crypto);
    
    app.use('/goldPrice', goldPrice);
}