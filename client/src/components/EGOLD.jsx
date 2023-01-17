import Web3 from 'web3';
import Tx from './Tx';
import useMeta from '../MetamaskLogin/useMeta';
import StripePayment from './StripePayment';

import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

export default function EGOLD({ backdrop, setBackdrop, tx, setTx, receipt, setReceipt }) {
    const { state: { EGOLDContract, accounts } } = useMeta();
    const [totalSupply, setTotalSupply] = useState("");
    const [availableSupply, setAvailableSupply] = useState("");
    const [EINRperEGOLD, setEINRperEGOLD] = useState("");
    const [INRperEGOLD, setINRperEGOLD] = useState("");
    const [myBalance, setMyBalance] = useState("");

    const [buy, setBuy] = useState("0");
    const [_Tx, set_Tx] = useState(false);
    const [success, setSuccess] = useState(false);
    const [RID, setRID] = useState("");

    const [funcName, setFuncName] = useState(null);

    useEffect(() => {
        if (accounts) {
            setTimeout(async () => {
                await EGOLDContract.methods.totalSupply().call({ from: accounts[0] })
                    .then(e => {
                        //console.log(e);
                        setTotalSupply(Web3.utils.fromWei(e, "ether"));
                    })
                    .catch(err => console.log(err));

                getDataHandler();
            })
        } else {
            setTotalSupply(null);
            setAvailableSupply(null);
            setEINRperEGOLD(null);
            setINRperEGOLD(null);
            setMyBalance(null);
        }
    }, [accounts])

    const getDataHandler = async () => {
        await EGOLDContract.methods.availableSupply().call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setAvailableSupply(Web3.utils.fromWei(e, "ether"));
            })
            .catch(err => console.log(err));

        await EGOLDContract.methods.EGoldPriceEINR().call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setEINRperEGOLD(Web3.utils.fromWei(e, "ether"));
            })
            .catch(err => console.log(err));

        await EGOLDContract.methods.EGoldPriceINR().call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setINRperEGOLD(Web3.utils.fromWei(e, "ether"));
            })
            .catch(err => console.log(err));

        await EGOLDContract.methods.balanceOf(accounts[0]).call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setMyBalance(Web3.utils.fromWei(e, "ether"));
            })
            .catch(err => console.log(err));
    }

    const setBuyHandler = (e) => {
        setBuy(e.target.value);
    }


    const buyEGOLD1 = async () => {
        setBackdrop(true);
        await EGOLDContract.methods.buyEGoldEINR(Web3.utils.toWei(buy, "ether"))
            .send({
                from: accounts[0]
            })
            .then(e => {
                //console.log(e);
                setReceipt(e)
                setTx(true);
            })
            .catch(async (err) => {
                setBackdrop(false);
                console.log(err)
            });
        getDataHandler();
        setBuy("0");
    }

    useEffect(() => {
        if (success) {
            setBackdrop(true);
            setTimeout(async () => {
                await EGOLDContract.methods.buyEGoldINR(Web3.utils.toWei(buy, "ether"), RID)
                    .send({
                        from: accounts[0]
                    })
                    .then(e => {
                        //console.log(e);
                        setReceipt(e)
                        setRID("");
                        setTx(true);
                    })
                    .catch(async (err) => {
                        setBackdrop(false);
                        console.log(err)
                    });
                getDataHandler();
                setBuy("0");
                setSuccess(false);
            })
        }
    }, [success])

    const buyEGOLD2 = () => {
        set_Tx(true);
    }

    const finalBuy = () => {
        if (!accounts) {
            alert("Please Connect Wallet.");
            return;
        }

        if (buy === "0") {
            alert("Enter valid quantity of EGOLD.");
            return;
        }

        funcName ?
            funcName === 'buyEGOLD1' ? buyEGOLD1() : buyEGOLD2()
            :
            alert("Please select payment method."); return;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "100px" }}>
            {backdrop && <Tx backdrop={backdrop} setBackdrop={setBackdrop} tx={tx} setTx={setTx} receipt={receipt} setReceipt={setReceipt} />}
            <div>
                <h1>Data</h1>
                <Table striped bordered hover >
                    <tbody>
                        <tr>
                            <th>1</th>
                            <th>Total Supply</th>
                            <td>{totalSupply ? `${totalSupply} EGOLD` : '--'}</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <th>2</th>
                            <th>Available Supply</th>
                            <td>{availableSupply ? `${availableSupply} EGOLD` : '--'}</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <th>3</th>
                            <th>EINR Per EGOLD </th>
                            <td>{EINRperEGOLD ? `${EINRperEGOLD} EINR` : '--'}</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <th>4</th>
                            <th>INR Per EGOLD </th>
                            <td>{INRperEGOLD ? `${INRperEGOLD} INR` : '--'}</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <th>5</th>
                            <th>My Balance</th>
                            <td>{myBalance ? `${myBalance} EGOLD` : '--'}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>

            <div style={{
                padding: "1rem",
                // display: "flex",
                width: "max-content",
                gap: "7px"
            }}>
                <div>
                    <h4>Buy EGOLD</h4>
                </div>
                <div style={{
                    padding: "0.5rem",
                    display: "flex",
                    justifyContent: "center",
                    gap: "75px",
                }}>
                    {funcName && <label><h5>{`Total Cost : ${funcName === 'buyEGOLD1' ? EINRperEGOLD * buy : INRperEGOLD * buy} ${funcName === 'buyEGOLD1' ? 'EINR' : 'INR'}`} </h5></label>}
                </div>
                <div style={{
                    padding: "0.5rem",
                    display: "flex",
                    gap: "100px"
                }}>
                    <label><h5>Enter EGold Qty.</h5></label>
                    <input onChange={setBuyHandler} value={buy} type='number' min={1} placeholder='EGOLD Qty.' />
                </div>
                <div style={{
                    padding: "0.5rem",
                    display: "flex",
                    gap: "25px"
                }}>
                    <label><h5>Select Payment Method :</h5></label>
                    <Form>
                        <div key='inline-radio' className="mb-3">
                            <Form.Check
                                inline
                                label={<strong>EINR</strong>}
                                name="BuyEGOLD"
                                type='radio'
                                id='1'
                                onChange={() => { setFuncName('buyEGOLD1') }}
                            />
                            <Form.Check
                                inline
                                label={<strong>INR</strong>}
                                name="BuyEGOLD"
                                type='radio'
                                id='2'
                                onChange={() => { setFuncName('buyEGOLD2') }}
                            />
                        </div>
                    </Form>
                </div>
                <div className="d-grid gap-2">
                    <Button variant="primary" size="lg" onClick={finalBuy}>
                        Buy
                    </Button>
                </div>
            </div>

            {_Tx && <StripePayment
                set_Tx={set_Tx}
                success={success}
                setSuccess={setSuccess}
                setRID={setRID}
                totalPrice={INRperEGOLD * buy}
                account={accounts[0]}
            />}
        </div>
    )
}
