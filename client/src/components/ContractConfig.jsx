import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Table from 'react-bootstrap/Table';

export default function ContractConfig() {

    const [accounts, setAccounts] = useState(null);

    const [contractEINR, setContractEINR] = useState(null);
    const [EINRAdd, setEINRAdd] = useState(null);
    const [EINR_EGOLDAdd, setEINR_EGOLDAdd] = useState(null);
    const [addEGOLD, setAddEGOLD] = useState("");


    const [contractEGOLD, setContractEGOLD] = useState(null);
    const [EGOLDAdd, setEGOLDAdd] = useState(null);
    const [EGOLD_EINRAdd, setEGOLD_EINRAdd] = useState(null);
    const [addEINR, setAddEINR] = useState("");





    useEffect(() => {
        setTimeout(async () => {
            const _web3 = new Web3(Web3.givenProvider);
            const _accounts = await _web3.eth.requestAccounts();
            const networkID = await _web3.eth.net.getId();
            setAccounts(_accounts);

            const artifactEINR = require(`../contracts/EINR.json`);
            let { abi } = artifactEINR;
            let addressEINR, contractEINR;
            try {
                addressEINR = artifactEINR.networks[networkID].address;
                contractEINR = new _web3.eth.Contract(abi, addressEINR);
            } catch (err) {
                console.error(err);
            }
            setContractEINR(contractEINR);
            setEINRAdd(addressEINR);

            await contractEINR.methods.EGOLD().call({ from: _accounts[0] })
                .then(e => {
                    //console.log(e);
                    setEINR_EGOLDAdd(e);
                })
                .catch(err => console.log(err));


            const artifactEGOLD = require(`../contracts/EGOLD.json`);
            ({ abi } = artifactEGOLD);
            let addressEGOLD, contractEGOLD;

            try {
                addressEGOLD = artifactEGOLD.networks[networkID].address;
                contractEGOLD = new _web3.eth.Contract(abi, addressEGOLD);
            } catch (err) {
                console.error(err);
            }
            setContractEGOLD(contractEGOLD);
            setEGOLDAdd(addressEGOLD);

            await contractEGOLD.methods._EINR().call({ from: _accounts[0] })
                .then(async (e) => {
                    //console.log(e);
                    setEGOLD_EINRAdd(e);
                })
                .catch(err => console.log(err));
        }, 100)

    }, [])

    const getDataHandler = async () => {
        await contractEINR.methods.EGOLD().call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setEINR_EGOLDAdd(e);
            })
            .catch(err => console.log(err));

        await contractEGOLD.methods._EINR().call({ from: accounts[0] })
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
        await contractEINR.methods.setEGOLD(addEGOLD)
            .send({
                from: accounts[0]
            })
            .then(e => {
                //console.log(e);
            })
            .catch(err => console.log(err));
        getDataHandler();
        setAddEGOLD("");
    }


    const setEINRHandler = (e) => {
        setAddEINR(e.target.value);
    }

    const setEINR = async () => {
        await contractEGOLD.methods.setEINR(addEINR)
            .send({
                from: accounts[0]
            })
            .then(e => {
                //console.log(e);
            })
            .catch(err => console.log(err));
        getDataHandler();
        setAddEINR("");
    }

    return (
        <div>
            <div>
                <h1>EINR Config</h1>
                <Table striped bordered hover>
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
                            <td>{EINRAdd && EINRAdd}</td>
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

                <div  style={{
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
                <Table striped bordered hover>
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
                            <td>{EGOLDAdd && EGOLDAdd}</td>
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

                <div  style={{
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
