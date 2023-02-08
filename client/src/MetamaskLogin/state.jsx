const initialState = {
    EINRArtifact: null, EGOLDArtifact: null, InventoryArtifact: null,
    EINRContract: null, EGOLDContract: null, InventoryContract: null,
    EINRAddress: null, EGOLDAddress: null, InventoryAddress: null,
    web3: null, networkID: null, accounts: null
};

const reducer = (state, action) => {
    const { type, data } = action;
    switch (type) {
        case 'init':
            return { ...state, ...data };
        case 'login':
            return { ...state, ...data };
        case 'logout':
            return { ...state, ...data };
        default:
            throw new Error("Undefined reducer action type");
    }
};

export {
    initialState,
    reducer
};
