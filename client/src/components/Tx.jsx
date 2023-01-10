import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import React from 'react'
import classes from './Tx.module.css';

export default function Tx({backdrop, setBackdrop, tx, setTx, receipt, setReceipt}) {
    const receiptType = () => {
        return Object.keys(receipt.events)[Object.keys(receipt.events).length - 1];

        // console.log(Object.keys(receipt.events)[Object.keys(receipt.events).length - 1]);
        // for (const i of Object.keys(receipt.events)) {
        //     if (i.length > 2) {
        //         // return i;
        //         console.log(i);
        //     }
        // }
    }
    const onClose = () => {
        setReceipt({});
        setTx(false);
        setBackdrop(false);
    }

    return (
        <>
            {<div className={classes.backdrop} />}
            {tx && <Card className={classes.modal} >
                <Card.Header><strong>{receiptType()}</strong></Card.Header>
                <Card.Body>
                    <Card.Title>Transaction Hash</Card.Title>
                    <Card.Text>
                        <Link onClick={() => window.open(`https://mumbai.polygonscan.com/tx/${receipt.transactionHash}`)}>{receipt.transactionHash}</Link>
                    </Card.Text>
                    <Button variant="primary" onClick={onClose}>Close</Button>
                </Card.Body>
            </Card>}
        </>
    )
}
