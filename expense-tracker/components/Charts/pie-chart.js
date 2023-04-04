import React, { Component } from "react";
const echarts = require("echarts"); //import echarts API
import chartStyle from "../../styles/Charts.module.scss";

//pie chart component
class PieCharts extends React.Component {
  constructor() {
    super();
  }
  async componentDidMount() {
    //initialize the chart
    var myChart = echarts.init(document.getElementById("pie"));
    //get userid from local storage
    let userId = localStorage.getItem("loggedInUserId");
    //fetch expense objects by userid
    const responseExpense = await fetch(
      `/api/getExpense` + "?userId=" + userId
    );
    let expense = await responseExpense.json();
    let currNum = 0;
    console.log("expense.message in chart", expense.message);
    let food = 0,
      entertainment = 0,
      medical = 0,
      selfcare = 0,
      housing = 0,
      travel = 0;
    if (expense.message.length > 0) {
      //sum up the expenses by category
      for (let i = 0; i < expense.message.length; i++) {
        let category = expense.message[i].category;
        if (category == "food" || category == "Food") {
          food += parseInt(expense.message[i].expense);
          // console.log(food);
        } else if (category == "entertainment" || category == "Entertainment") {
          entertainment += parseInt(expense.message[i].expense);
        } else if (category == "medical" || category == "Medical") {
          medical += parseInt(expense.message[i].expense);
        } else if (
          category == "selfcare" ||
          category == "Self Care" ||
          category == "Selfcare"
        ) {
          selfcare += parseInt(expense.message[i].expense);
        } else if (category == "housing" || category == "Housing") {
          housing += parseInt(expense.message[i].expense);
        } else if (category == "travel" || category == "Travel") {
          travel += parseInt(expense.message[i].expense);
        }
      }
    }
    //set the chart properties
    var option = {
      title: {
        text: "Expenses Portion",
        // subtext: "Per Month",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          type: "pie",
          data: [
            {
              value: food,
              name: "Food",
            },
            {
              value: entertainment,
              name: "Entertainment",
            },
            {
              value: medical,
              name: "Medical",
            },
            {
              value: selfcare,
              name: "Self Care",
            },
            {
              value: housing,
              name: "Housing",
            },
            {
              value: travel,
              name: "Travel",
            },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    myChart.setOption(option);
  }
  render() {
    // return <div id="main" style={{ width: "600px", height: "400px" }}></div>;
    return <div id="pie" className={chartStyle.chart}></div>;
  }
}
export default PieCharts;
