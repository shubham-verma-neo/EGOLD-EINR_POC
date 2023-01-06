import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Table from 'react-bootstrap/Table';

export default function EINR() {

    const [accounts, setAccounts] = useState(null);
    const [contract, setContract] = useState(null);

    const [myBalance, setMyBalance] = useState("");

    const [mint, setMint] = useState("");

    useEffect(() => {
        setTimeout(async () => {
            const artifact = require(`../contracts/EINR.json`);
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

            await contract.methods.balanceOf(_accounts[0]).call({ from: _accounts[0] })
                .then(e => {
                    //console.log(e);
                    setMyBalance(e);
                })
                .catch(err => console.log(err));
        }, 100)

    }, [])

    const getDataHandler = async () => {
        await contract.methods.balanceOf(accounts[0]).call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setMyBalance(e);
            })
            .catch(err => console.log(err));
    }

    const setMintHandler = (e) => {
        setMint(e.target.value);
    }

    const mintEINR = async () => {
        await contract.methods.mint(mint)
            .send({
                from: accounts[0]
            })
            .then(e => {
                //console.log(e);
            })
            .catch(err => console.log(err));
        getDataHandler();
        setMint("");
    }

    return (
        <div>
            <h1>Data</h1>
            <Table striped bordered hover>
                <tbody>
                    <tr>
                        <th>1</th>
                        <th>My Balance</th>
                        <td>{myBalance} EINR</td>
                    </tr>
                </tbody>
            </Table>
            <div  style={{
                    padding: "1rem",
                    display: "flex",
                    gap: "7px"
                }}>
                <label><h5>EINR</h5></label>
                <input onChange={setMintHandler} value={mint} placeholder='Enter EINR Amount'/>
                <button onClick={mintEINR}>Mint</button>

            </div>
        </div>
    )
}
