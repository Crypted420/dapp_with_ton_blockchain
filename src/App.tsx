
import { TonConnectButton } from '@tonconnect/ui-react';
import './App.css'
import { useMainContract } from './contracts/hooks/useMainContract';
import { useTonConnect } from './contracts/hooks/useTonconnect';
import { fromNano } from 'ton-core';

function App() {
  const { contract_address, contract_balance, counter_value, sendIncrement, sendDeposit, sendWithdrawalRequest } = useMainContract();

  const { connected } = useTonConnect();

  return (
    <>
      <div style={{ width: '100%', position: "relative", display: "flex", justifyContent: "center" }}>
        <TonConnectButton></TonConnectButton>
      </div>
      <div className="card">
        <b>Contract Address</b>
        <div className="hint">{contract_address?.slice(0, 30) + "...."}</div>
        <b>Contract balance</b>
        <div className="hint">{fromNano(contract_balance ?? 0)} Ton</div>
      </div>
      <div className="card">
        <b>Counter value</b>
        <div>{counter_value ?? "Loading..."}</div>
      </div>
      {
        connected && (
          <a onClick={() => sendIncrement()}>
            Increment by 5
          </a>
        )
      }
      <br />
      {
        connected && (
          <button onClick={() => sendDeposit()}>
            Deposit 1 TON
          </button>
        )
      }
      <br />
      <br />
      {
        connected && (
          <button onClick={() => sendWithdrawalRequest()}>
            Withdraw 1 Ton to contract owner
          </button>
        )
      }
    </>
  )
}

export default App
