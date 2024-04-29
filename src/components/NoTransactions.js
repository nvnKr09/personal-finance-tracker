import React from 'react';
import transaction from '../Assets/transactions.svg';

const NoTransactions = () => {
  return (
    <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginBottom: '2rem',
        }}
    >
        <img src={transaction} style={{ width:"320px", margin:"4rem" }} />
        <p style={{textAlign: "center", fontSize: "1.2rem" }}>You have No Transactions Currently</p>
    </div>
  )
}

export default NoTransactions