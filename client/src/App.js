import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import EINR from './components/EINR';
import EGOLD from './components/EGOLD';
import EGOLDConfig from './components/EGOLDConfig';
import ContractConfig from './components/ContractConfig';
import { MetaProvider } from './MetamaskLogin';

function App() {

  const [tx, setTx] = useState(false);
  const [backdrop, setBackdrop] = useState(false);
  const [receipt, setReceipt] = useState({});

  return (
    <MetaProvider>
      <Router>
        <Header />
        <Routes>

          <Route path='/' element={
            <EINR backdrop={backdrop} setBackdrop={setBackdrop} tx={tx} setTx={setTx} receipt={receipt} setReceipt={setReceipt} />
          } />

          <Route path='/EINR' element={
            <EINR backdrop={backdrop} setBackdrop={setBackdrop} tx={tx} setTx={setTx} receipt={receipt} setReceipt={setReceipt} />
          } />

          <Route path='/EGOLD' element={
            <EGOLD backdrop={backdrop} setBackdrop={setBackdrop} tx={tx} setTx={setTx} receipt={receipt} setReceipt={setReceipt} />
          } />

          <Route path='/ContractConfig' element={
            <ContractConfig backdrop={backdrop} setBackdrop={setBackdrop} tx={tx} setTx={setTx} receipt={receipt} setReceipt={setReceipt} />
          } />

          <Route path='/EGOLDConfig' element={
            <EGOLDConfig backdrop={backdrop} setBackdrop={setBackdrop} tx={tx} setTx={setTx} receipt={receipt} setReceipt={setReceipt} />
          } />
        </Routes>
      </Router>
    </MetaProvider>
  );
}

export default App;
