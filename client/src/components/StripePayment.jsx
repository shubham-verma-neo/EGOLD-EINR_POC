import React from 'react'

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import PaymentForm from "./PaymentForm"
import classes from './Tx.module.css';

const PUBLIC_KEY = "pk_test_51MPOvKSH9teV89VTVMCvOqd85C91CTFEZQCsFTMTJP1vcM2PqckaIVhFklz7ZJaGN7YWLnpc4SnjxVWDCkC4UUBt00liMm5opF"

const stripeTestPromise = loadStripe(PUBLIC_KEY)

export default function StripePayment({ set_Tx, success, setSuccess, totalPrice, account }) {
    return (
        <>
            < div className={classes.backdrop} />
            {< Elements stripe={stripeTestPromise} >
                <PaymentForm
                    set_Tx={set_Tx}
                    success={success}
                    setSuccess={setSuccess}
                    totalPrice={totalPrice}
                    account={account}
                /></Elements >}
        </>
    )
}
