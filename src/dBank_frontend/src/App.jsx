import React, { useState, useEffect } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { canisterId as dbank_id, idlFactory as dbank_idl} from "../../declarations/dBank_backend"                                                       
const agent = new HttpAgent({ host: 'http://127.0.0.1:3000' });
agent.fetchRootKey();
const dBank = Actor.createActor(dbank_idl, { agent, canisterId: dbank_id })


function DBankComponent() {
  const [currentBalance, setCurrentBalance] = useState(234); // Initial balance
  const [inputAmount, setInputAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    updateBalance();
  }, [currentBalance]); // Empty dependency array to run only once on component mount

  const handleSubmit = async (event) => {
    event.preventDefault();
    setButtonDisabled(true);

    if (inputAmount.length > 0) {
      await dBank.topUp(parseFloat(inputAmount));
    }

    if (withdrawalAmount.length > 0) {
      await dBank.withdraw(parseFloat(withdrawalAmount));
    }

    await dBank.compound();
    updateBalance();

    setInputAmount('');
    setWithdrawalAmount('');
    setButtonDisabled(false);
  };

  const updateBalance = async () => {
    const currentAmount = await dBank.checkBalance();
    setCurrentBalance(Math.round(currentAmount * 100) / 100);
  };

  return (
    <div className="container">
      <img src="dBank_logo.png" alt="DBank logo" width="100"/>
      <h1>Current Balance: ${currentBalance}</h1>
      <div className="divider"></div>
      <form onSubmit={handleSubmit}>
        <h2>Amount to Top Up</h2>
        <input 
          id="input-amount" 
          type="number" 
          step="0.01" 
          min="0" 
          name="topUp" 
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
        />
        <h2>Amount to Withdraw</h2>
        <input 
          id="withdrawal-amount" 
          type="number" 
          step="0.01" 
          min="0" 
          name="withdraw" 
          value={withdrawalAmount}
          onChange={(e) => setWithdrawalAmount(e.target.value)}
        />
        <input 
          id="submit-btn" 
          type="submit" 
          value="Finalise Transaction" 
          disabled={buttonDisabled}
        />
      </form>
    </div>
  );
}

export default DBankComponent;

