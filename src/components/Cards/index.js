import React from 'react';
import './styles.css';
import Button from '../Button';
import { Card, Row } from 'antd';

const Cards = ({income, expenses, totalBalance, showExpenseModal, showIncomeModal, handleReset }) => {
  return (
    <>
        <Row className='my-row'>
            <Card className='my-card'  bordered={true} >
              <h2>Current Balance</h2>
              <p>₹{totalBalance}</p>
              <Button text="Reset Balance" blue={true} onClick={handleReset} />
            </Card>
            <Card className='my-card'  bordered={true} >
              <h2>Total Income</h2>
              <p>₹{income}</p>
              <Button text="Add Income" blue={true} onClick={showIncomeModal}/>
            </Card>
            <Card className='my-card'  bordered={true} >
              <h2>Total Expense</h2>
              <p>₹{expenses}</p>
              <Button text="Add Expense" blue={true} onClick={showExpenseModal} />
            </Card>
        </Row>
    </>
  );
}

export default Cards;