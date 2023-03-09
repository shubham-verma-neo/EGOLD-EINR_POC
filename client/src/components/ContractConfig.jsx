import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Tx from './Tx';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import useMeta from '../MetamaskLogin/useMeta';

export default function ContractConfig({ backdrop, setBackdrop, tx, setTx, receipt, setReceipt }) {
    const { state: { EINRContract, EUSDContract, EGOLDContract, InventoryContract, accounts, EINRAddress, EUSDAddress, EGOLDAddress, InventoryAddress } } = useMeta();

    const [EINR_EGOLDAdd, setEINR_EGOLDAdd] = useState(null);
    const [EUSD_EGOLDAdd, setEUSD_EGOLDAdd] = useState(null);
    const [addEGOLD_EUSD, setAddEGOLD_EUSD] = useState("");
    const [addEGOLD_EINR, setAddEGOLD_EINR] = useState("");
    const [InventoryAdd, setInventoryAdd] = useState("");
    const [EGOLdAddress, setEGOLdAddress] = useState("");

    const [EGOLD_EINRAdd, setEGOLD_EINRAdd] = useState(null);
    const [EGOLD_EUSDAdd, setEGOLD_EUSDAdd] = useState(null);
    const [addEINR, setAddEINR] = useState("");
    const [addEUSD, setAddEUSD] = useState("");
    const [_InventoryAdd, set_InventoryAdd] = useState("");
    const [_EGOLDAddress, set_EGOLDAddress] = useState("");

    useEffect(() => {
        if (accounts) {
            setTimeout(async () => {
                getDataHandler();
            }, 100)
        } else {
            setEINR_EGOLDAdd('--');
            setEUSD_EGOLDAdd('--');
            setEGOLD_EINRAdd('--');
            setEGOLD_EUSDAdd('--');
            setInventoryAdd('--');
            setEGOLdAddress('--');
        }

    }, [accounts])

    const getDataHandler = async () => {
        await EINRContract.methods.EGOLD().call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setEINR_EGOLDAdd(e);
            })
            .catch(err => console.log(err));
        await EUSDContract.methods.EGOLD().call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setEUSD_EGOLDAdd(e);
            })
            .catch(err => console.log(err));
        await EGOLDContract.methods._EINR().call({ from: accounts[0] })
            .then(async (e) => {
                //console.log(e);
                setEGOLD_EINRAdd(e);
            })
        await EGOLDContract.methods._EUSD().call({ from: accounts[0] })
            .then(async (e) => {
                //console.log(e);
                setEGOLD_EUSDAdd(e);
            })
            .catch(err => console.log(err));
        await EGOLDContract.methods.inventoryHandler().call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setInventoryAdd(e);
            })
            .catch(err => console.log(err));
        await InventoryContract.methods.EGOLDAdd().call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setEGOLdAddress(e);
            })
            .catch(err => console.log(err));
    }

    const setEGOLDHandlerEINR = (e) => {
        setAddEGOLD_EINR(e.target.value);
    }
    const setEGOLDEINR = async () => {
        if (!accounts) {
            alert("Please Connect Wallet.");
            return;
        }
        setBackdrop(true);
        await EINRContract.methods.setEGOLD(addEGOLD_EINR)
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
        setAddEGOLD_EINR("");
    }

    const setEGOLDHandlerEUSD = (e) => {
        setAddEGOLD_EUSD(e.target.value);
    }
    const setEGOLDEUSD = async () => {
        if (!accounts) {
            alert("Please Connect Wallet.");
            return;
        }
        setBackdrop(true);
        await EUSDContract.methods.setEGOLD(addEGOLD_EUSD)
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
        setAddEGOLD_EUSD("");
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

    const setEUSDHandler = (e) => {
        setAddEUSD(e.target.value);
    }
    const setEUSD = async () => {
        if (!accounts) {
            alert("Please Connect Wallet.");
            return;
        }
        setBackdrop(true);
        await EGOLDContract.methods.setEUSD(addEUSD)
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
        setAddEUSD("");
    }


    const setInventoryAddHandler = (e) => {
        set_InventoryAdd(e.target.value);
    }

    const setInventory = async () => {
        if (!accounts) {
            alert("Please Connect Wallet.");
            return;
        }
        if (_InventoryAdd === "") {
            alert("Inventory Contract Address Invalid");
            return;
        }
        setBackdrop(true);
        await EGOLDContract.methods.setInventoryHandler(_InventoryAdd)
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
        set_InventoryAdd("");
    }

    const setEGOLDAddHandler = (e) => {
        set_EGOLDAddress(e.target.value);
    }

    const EGOLDAdd = async () => {
        if (!accounts) {
            alert("Please Connect Wallet.");
            return;
        }
        if (_EGOLDAddress === "") {
            alert("EGOLD Invalid");
            return;
        }
        setBackdrop(true);
        await InventoryContract.methods.setEGOLDAddress(_EGOLDAddress)
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
        set_EGOLDAddress("");
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
                    <label><h5>EGOLD Add</h5></label>
                    <input onChange={setEGOLDHandlerEINR} value={addEGOLD_EINR} placeholder='EGOLD Address' />
                    <Button onClick={setEGOLDEINR} variant="primary" size="sz" >
                        Set
                    </Button>

                </div>
            </div>
            <div>
                <h1>EUSD Config</h1>
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
                            <td>EUSD</td>
                            <td>{EUSDAddress && <Link onClick={() => window.open(`https://mumbai.polygonscan.com/token/${EUSDAddress}`)}>{EUSDAddress}</Link>}</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td>2</td>
                            <td>EGOLD</td>
                            <td>{EUSD_EGOLDAdd && EUSD_EGOLDAdd}</td>
                        </tr>
                    </tbody>
                </Table>

                <div style={{
                    padding: "1rem",
                    display: "flex",
                    gap: "7px"
                }}>
                    <label><h5>EGOLD Add</h5></label>
                    <input onChange={setEGOLDHandlerEUSD} value={addEGOLD_EUSD} placeholder='EGOLD Address' />
                    <Button onClick={setEGOLDEUSD} variant="primary" size="sz" >
                        Set
                    </Button>

                </div>
            </div>
            <div>
                <h1>Inventory Config</h1>
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
                            <td>Inventory</td>
                            <td>{InventoryAddress && <Link onClick={() => window.open(`https://mumbai.polygonscan.com/address/${InventoryAddress}`)}>{InventoryAddress}</Link>}</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td>2</td>
                            <td>EGOLD</td>
                            <td>{EGOLdAddress && EGOLdAddress}</td>
                        </tr>
                    </tbody>
                </Table>

                <div style={{
                    padding: "1rem",
                    display: "flex",
                    gap: "7px",
                    justifyItems: "center"
                }}>
                    <label><h5>EGOLD Add</h5></label>
                    <input onChange={setEGOLDAddHandler} value={_EGOLDAddress} placeholder='EGOLD Address' />
                    <Button onClick={EGOLDAdd} variant="primary" size="sz" >
                        Set
                    </Button>
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
                    <tbody>
                        <tr>
                            <td>3</td>
                            <td>EUSD</td>
                            <td>{EGOLD_EUSDAdd && EGOLD_EUSDAdd}</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td>4</td>
                            <td>Inventory</td>
                            <td>{InventoryAdd && InventoryAdd}</td>
                        </tr>
                    </tbody>
                </Table>

                <div style={{
                    padding: "1rem",
                    display: "flex",
                    gap: "10px"
                }}>
                    <label><h5>EINR Add</h5></label>
                    <input onChange={setEINRHandler} value={addEINR} placeholder='EINR Address' />
                    <Button onClick={setEINR} variant="primary" size="sz" >
                        Set
                    </Button>
                    <label><h5>EUSD Add</h5></label>
                    <input onChange={setEUSDHandler} value={addEUSD} placeholder='EUSD Address' />
                    <Button onClick={setEUSD} variant="primary" size="sz" >
                        Set
                    </Button>
                    <label><h5>Inventory Add</h5></label>
                    <input onChange={setInventoryAddHandler} value={_InventoryAdd} placeholder='Inventory Address' />
                    <Button onClick={setInventory} variant="primary" size="sz" >
                        Set
                    </Button>

                </div>

            </div>
        </div >
    )
}
