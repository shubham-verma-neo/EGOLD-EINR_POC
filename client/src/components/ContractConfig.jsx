import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Tx from './Tx';
import { Link } from 'react-router-dom';
import useMeta from '../MetamaskLogin/useMeta';

export default function ContractConfig({ backdrop, setBackdrop, tx, setTx, receipt, setReceipt }) {
    const { state: { EINRContract, EGOLDContract, accounts, EINRAddress, EGOLDAddress } } = useMeta();

    const [EINR_EGOLDAdd, setEINR_EGOLDAdd] = useState(null);
    const [addEGOLD, setAddEGOLD] = useState("");

    const [EGOLD_EINRAdd, setEGOLD_EINRAdd] = useState(null);
    const [addEINR, setAddEINR] = useState("");

    useEffect(() => {
        if (accounts) {
            setTimeout(async () => {
                await EINRContract.methods.EGOLD().call({ from: accounts[0] })
                    .then(e => {
                        //console.log(e);
                        setEINR_EGOLDAdd(e);
                    })
                    .catch(err => console.log(err));


                await EGOLDContract.methods._EINR().call({ from: accounts[0] })
                    .then(async (e) => {
                        //console.log(e);
                        setEGOLD_EINRAdd(e);
                    })
                    .catch(err => console.log(err));
            }, 100)
        } else {
            setEINR_EGOLDAdd('--');
            setEGOLD_EINRAdd('--');

        }

    }, [accounts])

    const getDataHandler = async () => {
        await EINRContract.methods.EGOLD().call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setEINR_EGOLDAdd(e);
            })
            .catch(err => console.log(err));

        await EGOLDContract.methods._EINR().call({ from: accounts[0] })
            .then(async (e) => {
                //console.log(e);
                setEGOLD_EINRAdd(e);
            })
            .catch(err => console.log(err));
    }

    const setEGOLDHandler = (e) => {
        setAddEGOLD(e.target.value);
    }

    const setEGOLD = async () => {
        if (!accounts) {
            alert("Please Connect Wallet.");
            return;
        }
        setBackdrop(true);
        await EINRContract.methods.setEGOLD(addEGOLD)
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
        setAddEGOLD("");
    }


    const setEINRHandler = (e) => {
        setAddEINR(e.target.value);
    }

    const setEINR = async () => {
        if (!accounts) {
            alert("Please Connect Wallet.");
            return;
        }
        setBackdrop(true);
        await EGOLDContract.methods.setEINR(addEINR)
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
        setAddEINR("");
    }

    return (
        <div>
            {backdrop && <Tx backdrop={backdrop} setBackdrop={setBackdrop} tx={tx} setTx={setTx} receipt={receipt} setReceipt={setReceipt} />}
            <div>
                <h1>EINR Config</h1>
                <Table striped bordered hover >
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Contract Name</th>
                            <th>Contract Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>EINR</td>
                            <td>{EINRAddress && <Link onClick={() => window.open(`https://mumbai.polygonscan.com/token/${EINRAddress}`)}>{EINRAddress}</Link>}</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td>2</td>
                            <td>EGOLD</td>
                            <td>{EINR_EGOLDAdd && EINR_EGOLDAdd}</td>
                        </tr>
                    </tbody>
                </Table>

                <div style={{
                    padding: "1rem",
                    display: "flex",
                    gap: "7px"
                }}>
                    <label><h5>Set EGOLD Add</h5></label>
                    <input onChange={setEGOLDHandler} value={addEGOLD} placeholder='EGOLD Address' />
                    <button onClick={setEGOLD}>Set</button>

                </div>
            </div>
            <div>
                <h1>EGOLD Config</h1>
                <Table striped bordered hover >
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Contract Name</th>
                            <th>Contract Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>EGOLD</td>
                            <td>{EGOLDAddress && <Link onClick={() => window.open(`https://mumbai.polygonscan.com/token/${EGOLDAddress}`)}>{EGOLDAddress}</Link>}</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td>2</td>
                            <td>EINR</td>
                            <td>{EGOLD_EINRAdd && EGOLD_EINRAdd}</td>
                        </tr>
                    </tbody>
                </Table>

                <div style={{
                    padding: "1rem",
                    display: "flex",
                    gap: "7px"
                }}>
                    <label><h5>Set EINR Add</h5></label>
                    <input onChange={setEINRHandler} value={addEINR} placeholder='EINR Address' />
                    <button onClick={setEINR}>Set</button>

                </div>
            </div>
        </div>
    )
}
