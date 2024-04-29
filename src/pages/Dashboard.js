import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import { addDoc, collection, deleteDoc, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import TransactionsTable from '../components/TransactionsTable';
import ChartComponent from '../components/Charts';
import NoTransactions from '../components/NoTransactions';

const Dashboard = () => {

  // State variables to manage transactions, user authentication, loading state, and modal visibility
  const [transactions, setTransactions] = useState([]);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  // State variables to track income, expenses, and total balance
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  // Function to show expense modal
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  }

  // Function to show income modal
  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  }

  // Function to hide expense modal
  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  }

  // Function to hide income modal
  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  }

  // Function to handle reset button
  const handleReset = async () => {
    try {
      
      setTransactions([]);    // Clear local transactions
  
      // Reset all transactions from Firestore collection 
      if (user) {
        const transactionsRef = collection(db, `users/${user.uid}/transactions`);
        
        // Retrieve all documents from the transactions collection
        const querySnapshot = await getDocs(transactionsRef);
  
        // Delete each document from the Firestore collection
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        toast.success("Transactions reset successfully!");
      }
    } catch (error) {
      console.error("Error resetting transactions:", error);
      toast.error("Failed to reset transactions");
    }
  }

  // Function to handle form submission
  const onFinish = (values, type) => {
    console.log('on finish', values, type);

    const newTransaction = {
      type: type,
      date: values.date.format('YYYY-MM-DD'),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  }

  // Function to add a new transaction to the firestore database
  async function addTransaction(transaction) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      // console.log("Document written by ID: ", docRef.id);
      toast.success("Transaction added!");
      setTransactions(prevTransactions => [...prevTransactions, transaction]);
      calculateBalance();
    } catch (error) {
      console.error("error adding document:" ,error);
      toast.error("couldn't add transaction");
    }
  }

  // Fetch transactions from Firestore on user change
  useEffect(()=>{
    // Get all docs from a collection
    fetchTransactions();
  }, [user]);

  // Recalculate balance whenever transactions change
  useEffect(()=>{
    calculateBalance();
  }, [transactions]);

  // // Function to calculate income, expenses, and total balance
  function calculateBalance() {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction)=>{
      if (transaction.type === 'income') {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  }

  // Function to fetch transactions from Firestore
  async function fetchTransactions(){
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push(doc.data());
      });
      setTransactions(transactionArray);
      console.log("transactionArray: ", transactionArray);
      // toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  // Sort transactions by date
  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <>
      <Header />
      <Cards
        income={income}
        expenses={expenses}
        totalBalance={totalBalance}
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
        handleReset={handleReset}
      />
      {transactions && transactions.length !== 0 ? (<ChartComponent sortedTransactions={sortedTransactions}/>) : (<NoTransactions/>)}
      <AddExpenseModal
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
      />
      <AddIncomeModal
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
      />
      <TransactionsTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions} />
    </>
  )
}

export default Dashboard;