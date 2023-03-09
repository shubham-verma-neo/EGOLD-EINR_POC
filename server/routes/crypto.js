const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cors = require("cors");
const { web3Func } = require('../startup/web3');
router.use(cors())
const { Transactions } = require('../model/transaction.model');
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)

router.post("/EUSD", cors(), async (req, res) => {
    const { web3, EUSDAddress, EUSDContract } = await web3Func();
    let { transactionId, address, amount } = req.body;
    // console.log(transactionId, address, amount)

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);
        // console.log(paymentIntent, "PI")
        // console.log(paymentIntent.payment_method)

        let transaction = await Transactions.find({ transactionId: paymentIntent.id })
        // console.log(transaction, "b4")

        if (transaction[0].status) {
            throw new Error('Minting for this payment already completed.')
        }

        const Account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        web3.eth.accounts.wallet.add(Account);

        let transactionObject = {
            from: Account.address,
            to: EUSDAddress,
            gas: 200000,
            gasPrice: '10000000000',
            nonce: await web3.eth.getTransactionCount(Account.address),
        };

        let receipt = await EUSDContract.methods.mint(address, web3.utils.toWei(("" + amount), "ether")).send(transactionObject);

        if (receipt.status) {
            transaction = await Transactions.findOneAndUpdate(
                { transactionId: transactionId },
                { $set: { status: true } },
                { returnOriginal: false });
        }

        // console.log(transaction, "after")

        web3.eth.accounts.wallet.remove(Account.address);

        res.json({
            message: "EUSD Minted.",
            status: true,
            amount: amount,
            address: address,
            receipt: receipt
        })
    } catch (error) {
        // console.log(error)
        res.status(400).json({
            message: "Minting Failed",
            status: false,
            error: error.message
        })
    }
})

router.post("/EINR", cors(), async (req, res) => {
    const { web3, EINRAddress, EINRContract } = await web3Func();
    let { transactionId, address, amount } = req.body;
    // console.log(transactionId, " transactionId", address, " address", amount, "amount")

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);
        // console.log(paymentIntent, "PI")
        // console.log(paymentIntent.payment_method)

        let transaction = await Transactions.find({ transactionId: paymentIntent.id })
        // console.log(transaction, "b4")

        if (transaction[0].status) {
            throw new Error('Minting for this payment already completed.')
        }

        const Account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        web3.eth.accounts.wallet.add(Account);

        let transactionObject = {
            from: Account.address,
            to: EINRAddress,
            gas: 200000,
            gasPrice: '10000000000',
            nonce: await web3.eth.getTransactionCount(Account.address),
        };
        let receipt = await EINRContract.methods.mint(address, web3.utils.toWei(("" + amount), "ether")).send(transactionObject);

        if (receipt.status) {
            transaction = await Transactions.findOneAndUpdate(
                { transactionId: transactionId },
                { $set: { status: true } },
                { returnOriginal: false });
        }
        // console.log(transaction, "after")

        web3.eth.accounts.wallet.remove(Account.address);

        res.json({
            message: "EINR Minted.",
            status: true,
            amount: amount,
            address: address,
            receipt: receipt
        })

    } catch (error) {
        // console.log(error)
        res.status(400).json({
            message: "Minting Failed",
            status: false,
            error: error.message
        })
    }


})

router.post("/EGOLD", cors(), async (req, res) => {
    const { web3, EGOLDAddress, EGOLDContract } = await web3Func();
    let { transactionId, address, amount } = req.body;
    // console.log(transactionId, " transactionId", address, "address", amount, "amount")

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);
        // console.log(paymentIntent, "PI")
        // console.log(paymentIntent.payment_method)

        let transaction = await Transactions.find({ transactionId: paymentIntent.id })
        // console.log(transaction, "b4")

        if (transaction[0].status) {
            throw new Error('Transaction already completed.')
        }

        const Account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        web3.eth.accounts.wallet.add(Account);

        let transactionObject = {
            from: Account.address,
            to: EGOLDAddress,
            gas: 200000,
            gasPrice: '10000000000',
            nonce: await web3.eth.getTransactionCount(Account.address),
        };
        let receipt, amountEGold;

        if (paymentIntent.currency.includes('inr')) {
            amountEGold = (paymentIntent.amount / 100) / web3.utils.fromWei(await EGOLDContract.methods.EGoldPriceINR().call({ from: Account.address }), "ether");
            receipt = await EGOLDContract.methods.buyEGoldINR(web3.utils.toWei("" + amountEGold, "ether"), address, paymentIntent.id).send(transactionObject);
        } else {
            amountEGold = (paymentIntent.amount / 100) / web3.utils.fromWei(await EGOLDContract.methods.EGoldPriceUSD().call({ from: Account.address }), "ether");
            receipt = await EGOLDContract.methods.buyEGoldUSD(web3.utils.toWei("" + amountEGold, "ether"), address, paymentIntent.id).send(transactionObject);
        }
        if (receipt.status) {
            transaction = await Transactions.findOneAndUpdate(
                { transactionId: transactionId },
                { $set: { status: true } },
                { returnOriginal: false });
        }

        // console.log(transaction, "after")

        web3.eth.accounts.wallet.remove(Account.address);

        res.json({
            message: "EGOLD transferred successfully.",
            status: true,
            amount: amount,
            address: address,
            receipt: receipt
        })
    } catch (error) {
        // console.log(error)
        res.status(400).json({
            message: "EGOLD transferred failed.",
            status: false,
            error: error.message
        })
    }


})

module.exports = router;
