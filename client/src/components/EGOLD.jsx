import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Table from 'react-bootstrap/Table';
import Tx from './Tx';

export default function EGOLD({ backdrop, setBackdrop, tx, setTx, receipt, setReceipt }) {

    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);

    const [totalSupply, setTotalSupply] = useState("");
    const [availableSupply, setAvailableSupply] = useState("");
    const [perEGOLD, setPerEGOLD] = useState("");
    const [myBalance, setMyBalance] = useState("");

    const [buy, setBuy] = useState("");

    useEffect(() => {
        setTimeout(async () => {
            const artifact = require(`../contracts/EGOLDContract.json`);
            const _web3 = new Web3(Web3.givenProvider);
            const _accounts = await _web3.eth.requestAccounts();
            const networkID = await _web3.eth.net.getId();
            const { abi } = artifact;
            let address, contract;
            try {
                address = artifact.networks[networkID].address;
                contract = new _web3.eth.Contract(abi, address);
            } catch (err) {
                console.error(err);
            }
            setAccounts(_accounts);
            setContract(contract);

            await contract.methods.totalSupply().call({ from: _accounts[0] })
                .then(e => {
                    //console.log(e);
                    setTotalSupply(Web3.utils.fromWei(e, "ether"));
                })
                .catch(err => console.log(err));

            await contract.methods.availableSupply().call({ from: _accounts[0] })
                .then(e => {
                    //console.log(e);
                    setAvailableSupply(Web3.utils.fromWei(e, "ether"));
                })
                .catch(err => console.log(err));

            await contract.methods.EGoldPrice().call({ from: _accounts[0] })
                .then(e => {
                    //console.log(e);
                    setPerEGOLD(Web3.utils.fromWei(e, "ether"));
                })
                .catch(err => console.log(err));

            await contract.methods.balanceOf(_accounts[0]).call({ from: _accounts[0] })
                .then(e => {
                    //console.log(e);
                    setMyBalance(Web3.utils.fromWei(e, "ether"));
                })
                .catch(err => console.log(err));

        }, 100)

    }, [])

    const getDataHandler = async () => {
        await contract.methods.availableSupply().call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setAvailableSupply(Web3.utils.fromWei(e, "ether"));
            })
            .catch(err => console.log(err));

        await contract.methods.EGoldPrice().call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setPerEGOLD(Web3.utils.fromWei(e, "ether"));
            })
            .catch(err => console.log(err));

        await contract.methods.balanceOf(accounts[0]).call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setMyBalance(Web3.utils.fromWei(e, "ether"));
            })
            .catch(err => console.log(err));
    }

    const setBuyHandler = (e) => {
        setBuy(e.target.value);
    }

    const buyEGOLD = async () => {
        setBackdrop(true);
        await contract.methods.buyGold(Web3.utils.toWei(buy, "ether"))
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
        setBuy("");
    }

    return (
        <div>
            {backdrop && <Tx backdrop={backdrop} setBackdrop={setBackdrop} tx={tx} setTx={setTx} receipt={receipt} setReceipt={setReceipt} />}
            <h1>Data</h1>
            <Table striped bordered hover>
                <tbody>
                    <tr>
                        <th>1</th>
                        <th>Total Supply</th>
                        <td>{totalSupply} EGOLD</td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <th>2</th>
                        <th>Available Supply</th>
                        <td>{availableSupply} EGOLD</td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <th>3</th>
                        <th>Per EGOLD Price</th>
                        <td>{perEGOLD} EINR</td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <th>4</th>
                        <th>My Balance</th>
                        <td>{myBalance} EGOLD</td>
                    </tr>
                </tbody>
            </Table>
            <div style={{
                padding: "1rem",
                display: "flex",
                gap: "7px"
            }}>
                <label><h5>{`Total Cost : ${perEGOLD * buy} EINR`} </h5></label>
            </div>
            <div style={{
                padding: "1rem",
                display: "flex",
                gap: "7px"
            }}>
                <label><h5>Buy EGOLD </h5></label>
                <input onChange={setBuyHandler} value={buy} placeholder='EGOLD Qty.' />
                <button onClick={buyEGOLD}>Buy</button>
            </div>
        </div>
    )
}
