import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import axios from "axios"
import React, { useState } from 'react'

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import classes from './Tx.module.css';

export default function PaymentForm({ success, setSuccess, set_Tx, totalPrice, account }) {
    const stripe = useStripe()
    const elements = useElements()
    const [payBackdrop, setPayBackdrop] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setPayBackdrop(true);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
        })

        if (!error) {
            try {
                const { id } = paymentMethod
                const response = await axios.post("http://localhost:4000/payment", {
                    account: account,
                    amount: totalPrice,
                    id
                })
                // console.log(response)
                if (response.data.success) {
                    console.log("Successful payment")
                    setPayBackdrop(false);
                    setSuccess(true);
                }
            } catch (error) {
                console.log("Error", error)
                setPayBackdrop(false);
                setSuccess(false);
            }
        } else {
            alert(error.message)
            console.log(error.message)
        }

        setTimeout(() => {
            set_Tx(false);
        }, 4000)
    }

    return (
        <>
            {
                !success ?
                    <>
                        {payBackdrop && <div style={{
                            position: "fixed",
                            top: "0",
                            left: "0",
                            width: "100%",
                            height: "100vh",
                            zIndex: "110",
                            background: "rgba(0, 0, 0, 0.75)",
                        }} />}
                        <Card className={classes.modal}>
                            <Card.Header><strong>Payment Details</strong></Card.Header>
                            <Card.Body >
                                <Card.Title>Card Details</Card.Title>
                                <CardElement />
                                <Button style={{ margin: '0.5rem' }} variant="primary" onClick={handleSubmit}>Pay</Button>
                                <Button style={{ margin: '0.5em' }} variant="primary" onClick={() => { set_Tx(false); }}>Close</Button>
                            </Card.Body>
                        </Card ></>
                    :
                    <Card className={classes.modal}>
                        <Card.Header><strong>Payment Successful</strong></Card.Header>
                        <Card.Body >
                            <Card.Title><strong>Thank You!!!</strong></Card.Title>
                            <Card.Text>Complete Your Metamask Transaction....</Card.Text>
                        </Card.Body>
                    </Card >
            }
        </>
    )
}