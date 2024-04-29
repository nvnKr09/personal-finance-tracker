import { Line, Pie } from "@ant-design/charts";
import { Transaction } from "firebase/firestore";
import React from "react";

const ChartComponent = ({ sortedTransactions }) => {
  const data = sortedTransactions.map((item) => {
    return { date: item.date, amount: item.amount };
  });

  const spendingData = sortedTransactions.filter((transaction) => {
    if (transaction.type === "expense") {
      return { tag: transaction.tag, amount: transaction.amount };
    }
  });

  let finalSpendings = spendingData.reduce((acc, obj) => {
    let key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: obj.tag, amount: obj.amount }; // create a new object with same properties
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});
  console.log(finalSpendings);
  //   Hardcoded logic for pie chart
  //   let newSpendings = [
  //     {
  //       tag: "food",
  //       amount: 0,
  //     },
  //     {
  //         tag: "education",
  //         amount: 0,
  //     },
  //     {
  //         tag: "office",
  //         amount: 0,
  //     }
  //   ];
  //   spendingData.forEach((item) => {
  //     if (item.tag === "food") {
  //         newSpendings[0].amount += item.amount;
  //     } else if(item.tag === "education") {
  //         newSpendings[1].amount += item.amount;
  //     } else if(item.tag === "office") {
  //         newSpendings[2].amount += item.amount;
  //     }
  //   });

  const config = {
    data,
    //   width: 800,
    //   height: 400,
    autoFit: true,
    xField: "date",
    yField: "amount",
  };

  const spendingConfig = {
    data: Object.values(finalSpendings),
    // width: 400,
    // height: 400,
    autoFit: true,
    angleField: "amount",
    colorField: "tag",
  };

  return (
    <div className="charts-wrapper">
      <div className="line-chart">
        <h2>Your Analytics</h2>
        <Line className="line" {...config} />
      </div>
      <div className="pie-chart">
        <h2>Your Spendings</h2>
        {Object.keys(finalSpendings).length !== 0 ? (
          <Pie className="pie" {...spendingConfig} />
        ) : (
          <p style={{ marginTop: "2rem", textAlign: "center" }}>
            Seems like you haven't spent anything till now...
          </p>
        )}
      </div>
    </div>
  );
};

export default ChartComponent;
