import Head from "next/head";
import UserNav from "../components/UserNav/UserNav";
import styles from "../styles/Home.module.scss";
import budgetStyle from "../styles/Budget.module.scss";
import MessageToast from "../components/MessageToast/MessageToast";
import { useState, useEffect } from "react";

// import Table from "react-bootstrap/Table";
export default function budget() {
  const [success, setSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [firstPageLoad, setFirstPageLoad] = useState(true);
  
  useEffect(() => {
    if (firstPageLoad) {
      // showTableData();
      let tableAll = document.getElementById("tableAll");
      tableAll ? (tableAll.style.display = "none") : "";
      setFirstPageLoad(false);
      setSuccess(false);
      setAlertMessage('');
    }
  });
  //clear td 
  const clearInnerHTML = async () => {
    let tableInfo = document.getElementById("tableInfo");
    tableInfo?(tableInfo.innerHTML = ""):"";
  };
  //fetch api
  const showTableData = async () => {
    let userId = localStorage.getItem("loggedInUserId");
    const responseBudget = await fetch(
      `/api/budget` + "?userId=" + userId 
    );
    let budget = await responseBudget.json();
    let tableAll = document.getElementById("tableAll");
    tableAll ? (tableAll.style.display = "inline-table") : "";
    console.log("message in budget about table", budget.message);
    await setTr(budget);
  };
  //setTr
  const setTr = async (budget: any) => {
      clearInnerHTML();
    let taskarea = document.getElementById("tableInfo");
    for (let i = 0; i < budget.message.length; i++) {
      taskarea?taskarea.append(await trList(budget.message[i])):"";
    }
  };
  //set Td
  const trList = async (data: any) => {
    let tr = document.createElement("Tr");
    let td1 = document.createElement("Td");
    td1.innerHTML = data.food;
    td1.classList.add("textInfo");
    let td2 = document.createElement("Td");
    td2.innerHTML = data.entertainment;
    td2.classList.add("textInfo");
    let td3 = document.createElement("Td");
    td3.innerHTML = data.medical;
    td3.classList.add("textInfo");
    let td4 = document.createElement("Td");
    td4.innerHTML = data.selfcare;
    td4.classList.add("textInfo");
    let td5 = document.createElement("Td");
    td5.innerHTML = data.housing;
    td5.classList.add("textInfo");
    let td6 = document.createElement("Td");
    td6.innerHTML = data.travel;
    td6.classList.add("textInfo");
    let td7 = document.createElement("Td");
    td7.innerHTML = data.year + "-" + data.month;
    td7.classList.add("textInfo");
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);
    return tr;
  };

  const handleUserBudget = async (e: any) => {
    e.preventDefault();
    // let date = new Date();
    let date = e.currentTarget[6].value.split("-");

    // post structure
    let budgetUser = {
      food: e.currentTarget[0].value,
      entertainment: e.currentTarget[1].value,
      medical: e.currentTarget[2].value,
      selfcare: e.currentTarget[3].value,
      housing: e.currentTarget[4].value,
      travel: e.currentTarget[5].value,
      saving: e.currentTarget[6].value,
      userId: localStorage.getItem("loggedInUserId"),
      year: date[0],
      month: date[1],
    };
    // console.log("budgetUser:", budgetUser);
    // save the post
    let response = await fetch("/api/budget", {
      method: "POST",
      body: JSON.stringify(budgetUser),
    });
    let res = await response.json();
    // console.log("res:", res);
    if (res.success) {
      setAlertMessage('Saved Successfully');
      setSuccess(true);
      showTableData();
    } else {
      setAlertMessage('System error');
      setSuccess(true);
    }
  };

  return (
    <div className={styles.homecover}>
      <Head>
        <title>Expense Tracker</title>
        <meta name="description" content="Manage and visualize your expenses" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      {
            success ? <MessageToast displayMessage={alertMessage} /> : <div/>
      }
      <main className={styles.mainHome}>
        <div className="maincontainer">
          <UserNav />
          {/* <div id='tableInfo'> */}
          <div className={budgetStyle.tableInfo}>
            <div className={budgetStyle.tableForm}>
              <table className={budgetStyle.budgetTable} id="tableAll">
                <thead>
                  <tr>
                    <th>
                      <span>Food</span>
                    </th>
                    <th>
                      <span>Entertainment</span>
                    </th>
                    <th>
                      <span>Medical</span>
                    </th>
                    <th>
                      <span>Self care</span>
                    </th>
                    <th>
                      <span>Housing</span>
                    </th>
                    <th>
                      <span>Travel</span>
                    </th>
                    <th>
                      <span>Date</span>
                    </th>
                  </tr>
                </thead>
                <tbody id="tableInfo"></tbody>
              </table>
              <form
                className={budgetStyle.budgetForm}
                onSubmit={(e) => handleUserBudget(e)}
                id="budget-user-form"
              >
                <div className={budgetStyle.budgetInfo}>
                  <label className={budgetStyle.formLabel}>Food:</label>
                  <input
                    name="foodBudget"
                    className={budgetStyle.formInput}
                    placeholder="0.00"
                    type="text"
                    required
                  />
                </div>
                <div className={budgetStyle.budgetInfo}>
                  <label className={budgetStyle.formLabel}>
                    Entertainment:
                  </label>
                  <input
                    name="entertainmentBudget"
                    placeholder="0.00"
                    className={budgetStyle.formInput}
                    type="text"
                    required
                  />
                </div>
                <div className={budgetStyle.budgetInfo}>
                  <label className={budgetStyle.formLabel}>Medical:</label>
                  <input
                    name="MedicalBudget"
                    placeholder="0.00"
                    className={budgetStyle.formInput}
                    type="text"
                    required
                  />
                </div>
                <div className={budgetStyle.budgetInfo}>
                  <label className={budgetStyle.formLabel}>Self care:</label>
                  <input
                    name="SelfcareBudget"
                    placeholder="0.00"
                    className={budgetStyle.formInput}
                    type="text"
                    required
                  />
                </div>
                <div className={budgetStyle.budgetInfo}>
                  <label className={budgetStyle.formLabel}>Housing:</label>
                  <input
                    name="HousingBudget"
                    placeholder="0.00"
                    className={budgetStyle.formInput}
                    type="text"
                    required
                  />
                </div>
                <div className={budgetStyle.budgetInfo}>
                  <label className={budgetStyle.formLabel}>Travel:</label>
                  <input
                    name="TravelBudget"
                    placeholder="0.00"
                    className={budgetStyle.formInput}
                    type="text"
                    required
                  />
                </div>
                <div className={budgetStyle.budgetInfo}>
                  <label className={budgetStyle.formLabel}>Date:</label>
                  <input
                    name="Date"
                    className={budgetStyle.formInput}
                    type="date"
                    required
                  />
                </div>
                <button className={budgetStyle.newlog} type="submit">
                  Submit
                </button>
                <button
                  className={budgetStyle.newlog}
                  onClick={showTableData}
                  type="button"
                >
                  Show Current budget
                </button>
                <span className={budgetStyle.subtleText}>
                  {" "}
                  * We will send you an email when your expenses exceed the
                  budget{" "}
                </span>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
