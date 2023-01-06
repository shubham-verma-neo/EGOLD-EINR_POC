import React from 'react';
import Header from './components/Header';
import ContractConfig from './components/ContractConfig';
import EINR from './components/EINR';
import EGOLD from './components/EGOLD';
import EGOLDConfig from './components/EGOLDConfig';
import Transaction from './components/Transaction';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {


  return (
    <Router>
      <Header />
      <Routes>

        <Route path='/EINR' element={
          <EINR />
        } />

        <Route path='/EGOLD' element={
          <EGOLD />
        } />

        <Route path='/ContractConfig' element={
          <ContractConfig />
        } />

        <Route path='/EGOLDConfig' element={
          <EGOLDConfig />
        } />

        <Route path='/Transaction' element={
          <Transaction />
        } />
      </Routes>
    </Router>
  );
}

export default App;
