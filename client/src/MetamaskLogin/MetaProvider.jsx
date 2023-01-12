import Web3 from 'web3';
import MetaContext from './MetaContext';

import React, { useCallback, useReducer, useEffect } from 'react'
import { reducer, initialState } from "./state";

function MetaProvider({ children }) {

    const [state, dispatch] = useReducer(reducer, initialState);

    const init = useCallback(
        async (EINRArtifact, EGOLDArtifact) => {
            if (EINRArtifact && EGOLDArtifact) {
                const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
                let accounts;
                setTimeout(async () => {
                    if (localStorage.getItem('Address')) {
                        accounts = await web3.eth.requestAccounts();
                    }
                    else {
                        accounts = null;
                    }
                }, 100)
                const networkID = await web3.eth.net.getId();
                let { abi } = EINRArtifact;
                let EINRAddress, EINRContract;
                try {
                    EINRAddress = EINRArtifact.networks[networkID].address;
                    EINRContract = new web3.eth.Contract(abi, EINRAddress);
                } catch (error) {
                    console.log(error);
                }

                ({ abi } = EGOLDArtifact);
                let EGOLDAddress, EGOLDContract;
                try {
                    EGOLDAddress = EGOLDArtifact.networks[networkID].address;
                    EGOLDContract = new web3.eth.Contract(abi, EGOLDAddress);
                } catch (error) {
                    console.log(error);
                }

                dispatch({
                    type: 'init',
                    data: { EINRArtifact, EGOLDArtifact, web3, networkID, EINRContract, EGOLDContract, EINRAddress, EGOLDAddress, accounts }
                })
                // console.log(EINRArtifact, EGOLDArtifact, web3, networkID, EINRContract, EGOLDContract );

            }
        }, [])

    useEffect(() => {
        const tryInit = async () => {
            try {
                const EINRArtifact = require('../contracts/EINRContract.json');
                const EGOLDArtifact = require('../contracts/EGOLDContract.json');
                init(EINRArtifact, EGOLDArtifact);
            } catch (error) {
                console.log(error);
            }
        }
        tryInit();
    }, [init])

    useEffect(() => {
        const events = ["chainChanged", "accountsChanged"];
        const handleChange = () => {
            init(state.EINRArtifact, state.EGOLDArtifact);
            const accounts = null;
            localStorage.removeItem('Address');
            dispatch({
                type: 'logout',
                data: { accounts }
            })
        };

        events.forEach(e => { window.ethereum.on(e, handleChange) });
        return () => {
            events.forEach(e => window.ethereum.removeListener(e, handleChange));
        };
    }, [init, state.EINRArtifact, state.EGOLDArtifact]);

    const logIn = async () => {
        try {
            const accounts = await state.web3.eth.requestAccounts();
            localStorage.setItem('Address', accounts[0]);
            dispatch({
                type: 'login',
                data: { accounts }
            })
        } catch (error) {
            console.log(error);
        }

    }

    const logOut = async () => {
        try {
            const accounts = null;
            localStorage.removeItem('Address');
            dispatch({
                type: 'logout',
                data: { accounts }
            })
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <MetaContext.Provider value={{ state, dispatch, logIn, logOut }}>
            {children}
        </MetaContext.Provider>


    )
}

export default MetaProvider;