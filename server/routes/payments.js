const express = require('express');
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)
const cf = require('cashfree-sdk');
const { Transactions } = require('../model/transaction.model');
const cors = require("cors")

router.use(cors())

router.post("/stripe", cors(), async (req, res) => {
    let { address, amount, from, to, shipping } = req.body
    // console.log(address, " address", amount, " amount", from, " from" ,to, " to",shipping, " shipping")
    let transaction;
    try {

    let payment;
        payment = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: from,
            description: `${from}-${to} {${address}}`,
            confirm: true,
            payment_method: 'pm_card_visa',
            shipping: {
                name: shipping.name,
                address: {
                    line1: shipping.address.line1,
                    postal_code: +shipping.address.postal_code,
                    city: shipping.address.city,
                    country: shipping.address.country,
                },
            },
        })
        // console.log(payment.id)
        transaction = await new Transactions({
            transactionId: payment.id,
            address: address,
            amount: amount,
            from: from,
            to: to,
            status: false
        }).save();
        // console.log("tran", transaction)
        // console.log("Payment", payment)

        res.json({
            message: "Payment initiated.",
            success: true,
            secret: payment.client_secret,
        })
    } catch (error) {
        // console.log("Error", error)
        res.status(400).json({
            message: "Payment failed",
            success: false,
            error: error.message
        })
    }
})

router.post('/cashFree', async (req, res) => {
    const data = {
        "orderId": "ORD0001",
        "orderAmount": "1000",
        "orderCurrency": "INR",
        "customerName": "John Doe",
        "customerEmail": "john.doe@example.com",
        "customerPhone": "9999999999",
        "returnUrl": "https://example.com/return",
        "notifyUrl": "https://example.com/notify"
    };

    const config = {
        "env": "test",
        "appId": "3198133a3c0350e72ab3c28040318913",
        "secretKey": "437ee22410689deb88c0d9d37b25937fb224f5db"
    };

    const paymentOrder = await cf.Payment.Order.create(data, config);
    console.log(paymentOrder);

})
module.exports = router;
