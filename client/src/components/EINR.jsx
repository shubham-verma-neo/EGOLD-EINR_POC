import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Table from 'react-bootstrap/Table';
import Tx from './Tx';
import useMeta from '../MetamaskLogin/useMeta';

export default function EINR({ backdrop, setBackdrop, tx, setTx, receipt, setReceipt }) {
    const { state: { EINRContract, accounts } } = useMeta();


    const [myBalance, setMyBalance] = useState("");

    const [mint, setMint] = useState("0");

    useEffect(() => {
        if (accounts) {
            setTimeout(async () => {
                await EINRContract.methods.balanceOf(accounts[0]).call({ from: accounts[0] })
                    .then(e => {
                        //console.log(e);
                        setMyBalance(Web3.utils.fromWei(e, "ether"));
                    })
                    .catch(err => console.log(err));
            }, 100)
        } else {
            setMyBalance(null);
        }
    }, [accounts])

    const getDataHandler = async () => {
        await EINRContract.methods.balanceOf(accounts[0]).call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setMyBalance(Web3.utils.fromWei(e, "ether"));
                // setMyBalance(e);
            })
            .catch(err => console.log(err));
    }

    const setMintHandler = (e) => {
        setMint(e.target.value);
    }

    const mintEINR = async () => {
        if (!accounts) {
            alert("Please Connect Wallet.");
            return;
        }
        if (mint === "0") {
            alert("Mint amount should be greater than 0");
            return;
        }
        setBackdrop(true);
        await EINRContract.methods.mint(Web3.utils.toWei(mint, "ether"))
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
        setMint("0");
    }

    return (
        <div>
            {backdrop && <Tx backdrop={backdrop} setBackdrop={setBackdrop} tx={tx} setTx={setTx} receipt={receipt} setReceipt={setReceipt} />}
            <h1>Data</h1>
            <Table striped bordered hover >
                <tbody>
                    <tr>
                        <th>1</th>
                        <th>My Balance</th>
                        <td>{myBalance ? `${myBalance} EINR` : '--'}</td>
                    </tr>
                </tbody>
            </Table>
            <div style={{
                padding: "1rem",
                display: "flex",
                gap: "7px"
            }}>
                <label><h5>EINR</h5></label>
                <input onChange={setMintHandler} value={mint} type='number' min={1} placeholder='Enter EINR Amount' />
                <button onClick={mintEINR}>Mint</button>

            </div>
        </div>
    )
}
