import { Radio, Select, Table } from "antd";
import React, { useState } from "react";
import searchIcon from "../../Assets/search.svg";
import './styles.css';
import { parse, unparse } from "papaparse";
import { toast } from "react-toastify";
import { render } from "@testing-library/react";

const TransactionsTable = ({ transactions, addTransaction, fetchTransactions }) => {
  const { Option } = Select;
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  const columns = [
    {
      title: "#",  // S.No.
      dataIndex: "index",
      key: "index",
      render: (text, record, index)=> index+1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  let fileredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      item.type.includes(typeFilter)
  );

  let sortedTransactions = fileredTransactions.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  function exportToCsv() {
    var csv = unparse({
        fields: ["name", "amount", "tag", "type", "date"],
        data: transactions,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions_${new Date().toISOString().split('T')[0] }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // toast.success("File Export Success");
  }

  function importFromCsv(event) {
    event.preventDefault();
    try {
        parse(event.target.files[0],{
            header: true,
            complete: async function(result){
                // now result.data is an array of objects representing your csv rows
                for(const transaction of result.data){
                    // write transaction to firebase, can add transaction function here
                    // console.log("transaction>>", transaction);
                    const newTransaction = {
                        ...transaction,
                        amount: parseFloat(transaction.amount),
                    };
                    await addTransaction(newTransaction, true);
                }
            }
        });
        toast.success("All transactions Added");
        fetchTransactions();
        event.target.files = null;
    } catch (error) {
        toast.error(error.message);
    }
  }

  return (
    <>
      <div className="search-select-wrapper">
        <div className="searchbar">
          <img src={searchIcon} width="16" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name"
          />
        </div>
        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear="true"
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>
      <div className="table-wrapper">
        <div className="table-head">
          <h2>My Transactions</h2>
          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Date</Radio.Button>
            <Radio.Button value="amount">Amount</Radio.Button>
          </Radio.Group>
          <div className="export-import-btns-wrapper">
            <button className="btn" onClick={exportToCsv}>Export to CSV</button>
            <label htmlFor="file-csv" className="btn btn-blue">Import from CSV</label>
            <input onChange={importFromCsv} type="file" id="file-csv" accept=".csv" style={{display:"none"}} />
          </div>
        </div>
        <Table className="table" dataSource={sortedTransactions} columns={columns} />
      </div>
    </>
  );
};

export default TransactionsTable;
