const express = require("express")
const app = express()
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)
const bodyParser = require("body-parser")
const cors = require("cors")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())

app.post("/payment", cors(), async (req, res) => {
    let { amount, id, account } = req.body
    try {
        const payment = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: "INR",
            description: `EGOLD-${account}`,
            payment_method_types: ['card'],
            payment_method: id,
            confirm: true
        })
        console.log("Payment", payment)
        res.json({
            message: "Payment successful",
            id: payment.id,
            success: true
        })
    } catch (error) {
        console.log("Error", error)
        res.json({
            message: "Payment failed",
            success: false
        })
    }
})

// app.post("/refund", cors(), async (req, res) => {
//     let { intent_id, amount, id } = req.body
//     console.log(intent_id);
//     try {
//         const payment = await stripe.refunds.create({
//             payment_intent: intent_id,
//             amount: 10000,
//             reason:"blockchain_transfer_failed",
//         });
//         console.log("Refund", payment)
//         res.json({
//             message: "Refund successful",
//             success: true
//         })
//     } catch (error) {
//         console.log("Error", error)
//         res.json({
//             message: "Refund failed",
//             success: false
//         })
//     }
// })

app.listen(process.env.PORT || 4000, () => {
    console.log("Sever is listening on port 4000")
})