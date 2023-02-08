import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Table from 'react-bootstrap/Table';
import Tx from './Tx';
import Button from 'react-bootstrap/Button';
import useMeta from '../MetamaskLogin/useMeta';

export default function EGOLDConfig({ backdrop, setBackdrop, tx, setTx, receipt, setReceipt }) {
    const { state: { EGOLDContract, accounts } } = useMeta();

    const [EINRperEGOLD, setEINRperEGOLD] = useState("");
    const [EGOLDpriceEINR, setEGOLDpriceEINR] = useState("0");

    const [INRperEGOLD, setINRperEGOLD] = useState("");
    const [EGOLDpriceINR, setEGOLDpriceINR] = useState("0");

    useEffect(() => {
        if (accounts) {
            setTimeout(async () => {
                getDataHandler();
            }, 100)
        } else {
            setEINRperEGOLD(null);
            setINRperEGOLD(null);
        }

    }, [accounts])

    const getDataHandler = async () => {
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
    }

    const setEGOLD_EINR_PriceHandler = (e) => {
        setEGOLDpriceEINR(e.target.value);
    }

    const setEGOLD_EINR = async () => {
        if (!accounts) {
            alert("Please Connect Wallet.");
            return;
        }
        if (EGOLDpriceEINR === "0") {
            alert("EGOLD price should be greater than 0");
            return;
        }
        setBackdrop(true);
        await EGOLDContract.methods.setGoldPriceEINR(Web3.utils.toWei(EGOLDpriceEINR, "ether"))
            .send({
                from: accounts[0]
            })
            .then(e => {
                //console.log(e);
                setReceipt(e)
                setTx(true);
            })
            .catch(err => {
                setBackdrop(false);
                console.log(err)
            });
        getDataHandler();
        setEGOLDpriceEINR("0");
    }

    const setEGOLD_INR_PriceHandler = (e) => {
        setEGOLDpriceINR(e.target.value);
    }

    const setEGOLD_INR = async () => {
        if (!accounts) {
            alert("Please Connect Wallet.");
            return;
        }
        if (EGOLDpriceINR === "0") {
            alert("EGOLD price should be greater than 0");
            return;
        }
        setBackdrop(true);
        await EGOLDContract.methods.setGoldPriceINR(Web3.utils.toWei(EGOLDpriceINR, "ether"))
            .send({
                from: accounts[0]
            })
            .then(e => {
                //console.log(e);
                setReceipt(e)
                setTx(true);
            })
            .catch(err => {
                setBackdrop(false);
                console.log(err)
            });
        getDataHandler();
        setEGOLDpriceINR("0");
    }


    return (
        <div>
            {backdrop && <Tx backdrop={backdrop} setBackdrop={setBackdrop} tx={tx} setTx={setTx} receipt={receipt} setReceipt={setReceipt} />}
            <h1>Data</h1>
            <Table striped bordered hover >
                <tbody>
                    <tr>
                        <th>1</th>
                        <th>EINR Per EGOLD </th>
                        <td>{EINRperEGOLD ? `${EINRperEGOLD} EINR` : '--'}</td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <th>2</th>
                        <th>INR Per EGOLD </th>
                        <td>{INRperEGOLD ? `${INRperEGOLD} INR` : '--'}</td>
                    </tr>
                </tbody>
            </Table>
            <div style={{
                padding: "1rem",
                display: "flex",
                gap: "50px"
            }}>
                <div style={{
                    gap: "10px"
                }}>
                    <label><h5>Set EGOLD Price EINR</h5></label><br />
                    <input onChange={setEGOLD_EINR_PriceHandler} value={EGOLDpriceEINR} type='number' min={1} placeholder='Price in EINR' />
                    <Button onClick={setEGOLD_EINR} variant="primary" size="sz" >
                        Set
                    </Button><br />

                </div>
                <div>
                    <label><h5>Set EGOLD Price INR</h5></label><br />
                    <input onChange={setEGOLD_INR_PriceHandler} value={EGOLDpriceINR} type='number' min={1} placeholder='Price in EINR' />
                    <Button onClick={setEGOLD_INR} variant="primary" size="sz" >
                        Set
                    </Button><br />
                </div>
            </div>

        </div>
    )
}
