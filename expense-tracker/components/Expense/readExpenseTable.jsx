// using react and useState
import React, { useEffect ,useState} from 'react';
// using styles from Expene module
import styleExpense from '../../styles/Expense.module.scss'
import style from '../../styles/allStyles.module.scss'
// import expenseStyle from '../../styles/Expense.module.scss'
import { useQueryClient, useMutation } from "react-query";
import { addUser } from "../../lib/helper"
// email library
import emailjs from "emailjs-com";

 
export default function Table(){
// setting state for update function
    const[show,setShow] =useState(false)
// setting state for add function
    const[showAdd,setShowAdd] =useState(false)
// storing state name inside getname 
    const [name, getname] = useState("");
// storing state UpdateMsg inside getUpdateMsg
    const [updateMsg, getUpdateMsg] = useState(false);
// storing state categoryExpense inside getCategoryExpense
    const [categoryExpense, getCategoryExpense]= useState("");
// storing state desccription inside getdescription
    const [description, getdescription]= useState("");
// storing state amount inside getamoutExpense
    const [amountExpense, getamountExpense]= useState("");
// 
    const [uniqId, getUniqId]= useState("");
    const [selected, setselected]= useState(true);
    const [dateInfo, setDateInfo]= useState("");

    // -----------------------------------------------------------------------------------------------------
    const [selects, setSelects] =useState("");
    const [firstPageLoad, setFirstPageLoad] = useState(true);
    const [clearTaskList, setClearTaskList] = useState(false);
    const [addTaskFlag, setAddTaskFlag] = useState(false);

    // function call fir useEffect

    useEffect(()=>{
      if(clearTaskList && updateMsg){
        getUpdateMsg(false);
          }
// adding Task Flag and Clear Task Flag
      if(clearTaskList && addTaskFlag){
        clearInnerHTML();
        // calling get expense function
      getExpense();
      setAddTaskFlag(false);
         }
// loading firts page
      if(firstPageLoad){
// calling get expense function
          getExpense();
          setFirstPageLoad(false);
          setClearTaskList(true);
         }
    });
// toogle function for update form
      const handleclick = () =>{
// setting polarity to the show
          setShow(!show)
      }
// toogle function for add form
       const handleclickAdd = () =>{
// setting polarity for the set showadd function
          setShowAdd(!showAdd)
      }
// handler function for updating the expense
    const getUpdateTask= async(task)=>{
// getting data(name, category, description, expense amount, id) from form
        getname(task.name);
        getCategoryExpense(task.category)
    getdescription(task.description);
    getamountExpense(task.expense)
    setDateInfo(task.date);

    getUniqId(task._id);

        console.log("category",selects);
        console.log("name",name);
        console.log("description",description);
        console.log("expense",amountExpense);
        console.log("addTaskFlag",addTaskFlag);
// setting get update message as true
        getUpdateMsg(true);
       }
// handler function for adding form inside the data
      const handleSubmit =async(e)=>{
// calling prevent default function
        e.preventDefault();
// setting message for no form data
        if(e.currentTarget.length==0)return console.log("Dont have form data")
// getting userID from local storage
        let userId = localStorage.getItem("loggedInUserId");
// storing data inside formDATA
        const formData ={
            name:e.currentTarget[0].value,
            userId,
            category:e.currentTarget[1].value,
            description:e.currentTarget[2].value,
            expense:e.currentTarget[3].value,
            date:e.currentTarget[4].value,
            status:e.currentTarget[5].checked?"Active":"InActive"
        }
      console.log("formData:", formData);
// Calling the API using Post 
      const Options = {
        method: "POST",
        body: JSON.stringify(formData),
      };
// fetch function
      const response = await fetch(`/api/expense`, Options);
      sendEmail(formData);
      console.log("response:", response);
    setAddTaskFlag(true);
    console.log("clearTaskList in add",clearTaskList);
    console.log("addTaskFlag in add",addTaskFlag);
// toogle fucntion for closing the add form
    setShowAdd(!showAdd)
    }


    /**
 * get total expense by userId and category
 * @param {} userId 
 * @param {*} category 
 * @returns 
 */
// function for getting currency by category
     async function getCurrentExpenseByCatergory(userId, category, getByMonth){
        let responseExpense;
        // getting current date
        var date = new Date();
        // getting current month
        let currMonth = date.getMonth() + 1;
        if(getByMonth){
          // checking conditions
          responseExpense = await fetch(
            `/api/getExpense` +
              "?userId=" +
              userId +
              "&category=" +
              category +
              "&month=" +
              currMonth +
              "&year=" +
              date.getFullYear()
          );
        }else{
          // fetching data
          responseExpense = await fetch(
            `/api/getExpense` + "?userId=" + userId + "&category=" + category
          );
        }

          let expense = await responseExpense.json();
          let currNum = 0;
          if(expense.message.length > 0){
              for(let i = 0; i < expense.message.length; i++){
                  let curr = parseInt(expense.message[i].expense);
                  currNum += curr;
              }
          }
          return currNum;
      }
      // sending mail function

    //   -------------------------------------------
    async function sendEmail(formdata) {
        let userId = localStorage.getItem("loggedInUserId");
        let date = formdata.date.split("-");
        let year = date[0];
        let month = date[1];
        let category = formdata.category;
        //get current budget with all categories
        // fetching response budget
        const responseBudget = await fetch(
          `/api/budget` + "?userId=" + userId + "&year=" + year + "&month=" + month
        );
        let budget = await responseBudget.json();
        console.log("message in helper", budget.message);
        if(budget.message.length > 0){
          let money = 0;
          // getting current expense by category function
        await getCurrentExpenseByCatergory(userId, category,true).then(function(res){
          money = parseInt(res);
          })
        let allType = Object.keys(budget.message[0]);
          let index = 0;
        for(let i = 0; i < allType.length; i++){
          if(allType[i] == category.toLowerCase()) {
              index = i;
              break;
          }
        }
        // setting current budget fucntion
        let currBudget = parseInt(Object.values(budget.message[0])[index]);
        if (currBudget < money && currBudget != 0) {
          let email = localStorage.getItem("userEmail");
          let name = localStorage.getItem("userName");
          console.log("email:", email);
          console.log("name:", name);
          // setting the message parameterr
          let keyMsg = {
            name: name,
            category: category,
            user_email: email,
          };
          console.log("email in helper",email);
          //search the expense of current user
          emailjs.send(
            "service_tpp9hki",
            "template_xy60q9p",
            keyMsg,
            "_2Ux_j3fmDUxyJ8BI"
          );
        }
        }
      }
  //  delete task
    const deleteTask = async (task) => {
  // taking the delete ID
        let taskId = task._id;
  // Calling API by DELETE method
        const Options = {
            method: "DELETE",
            body: taskId,
          };
    // fetching the API
        await fetch('/api/expense',Options);

        // calling the toggle form function
        setAddTaskFlag(true);
        
      } 
// handling the submit form for update
    const handleSubmitUpdate =async(e)=>{
// calling the prevent default
        e.preventDefault();
// checking if it has form data
        if(e.currentTarget.length==0)return console.log("Dont have form data")
// getting data inside form and storing it inside formData
        const formData ={
            name:e.currentTarget[0].value,
            category:e.currentTarget[1].value,
            description:e.currentTarget[2].value,
            expense:e.currentTarget[3].value,
            uniqId:uniqId
        }

      console.log("formData:", formData);
// calling the PUT mehtod for updating the data
      const Options = {
        method: "PUT",
        body: JSON.stringify(formData),
      };

      console.log("uniqId:",uniqId);

// fetch function
      const response = await fetch(`/api/expense`, Options);
      let sendEmailData = formData;
      sendEmailData.date = dateInfo;
      sendEmail(sendEmailData);
      console.log("response:", response);
    setAddTaskFlag(true);
    console.log("clearTaskList in add",clearTaskList);
    console.log("addTaskFlag in add",addTaskFlag);
// toggle form function
    setShow(!show)
    }
// get expense function
    const getExpense = async()=>{
    let userId = localStorage.getItem("loggedInUserId");
// get expense using particular user ID
    const response =await fetch(`/api/expense?userId=`+userId)
// getting response
    let data = await response.json();
// passing the userID data inside the addTr function
    await addTr(data);
}
 
// addTr function
const addTr = async (data) => {
// getting by using elementByid
let expenseArea = document.getElementById('tableShow'); 
// appending data inside the list
for (let i=0; i<data.message.length;i++) {
    expenseArea.append(await trList(data.message[i]));      
}         
}
// operationsof the trList
const trList = async(data) => {
// creatin g a tr tag
let tr = document.createElement('Tr');  
// tag for name 
let td1 = document.createElement('Td');
td1.innerHTML = data.name;
// tag for category
let td2 = document.createElement('Td');
td2.innerHTML = data.category;
// td tag for description
let td3 = document.createElement('Td');
td3.innerHTML = data.description;
// td tag for showing expense amount
let td4 = document.createElement('Td');
td4.innerHTML = data.expense;
// td tag for showing date
let td5 = document.createElement('Td');
td5.innerHTML = data.date;
// tc tag for button
let td6 = document.createElement('Td');
let td6btn = document.createElement('Button');
td6btn.innerHTML = "Delete";
// td6btn.classList.add('styleExpense.formDeletebtn');
td6btn.classList.add(selected ? styleExpense.formDeletebtn : '')
td6btn.addEventListener('click', function() { deleteTask(data) }, false);
td6.appendChild(td6btn);
// td tag for update function
let td7 = document.createElement('Td');
let td7btn = document.createElement('Button');
// eventlistener for the getUpdatetask function
td7btn.addEventListener('click', function (){ handleclick(), getUpdateTask(data)});

td7btn.classList.add(selected ? styleExpense.formUpdatebtn : '')
td7btn.innerHTML = "Update";
td7.appendChild(td7btn);
// appendfing all the td tags inside the tr tag
tr.appendChild(td1);
tr.appendChild(td2);
tr.appendChild(td3);
tr.appendChild(td4);
tr.appendChild(td5);
tr.appendChild(td6);
tr.appendChild(td7);

return tr;
}
const clearInnerHTML = async() => {
document.getElementById('tableShow').innerHTML = '';
}
      
    return(
        // --------------------------ADD-------------
        // onClick function for add expense operation
        <div>

          <div><button className={styleExpense.addNewExpense} onClick={function () {handleclickAdd()}}>Add Expense</button></div>

        <div>
{/* toggle function for add expense button */}
        { showAdd?<form className={styleExpense.expenseForm} onSubmit={(e) => handleSubmit(e)}>
{/* setting label and input field for expense name */}
        <div className={styleExpense.expenseInfo}>
            <label className={styleExpense.formlabel}>Expense Name</label>
            <input  className={styleExpense.forminput} type="text"  name="name" required />
        </div>
{/* setting label and input field for expense category */} 
        <div className={styleExpense.expenseInfo}>
        <label className={styleExpense.formlabel}>Expense Category</label>
        <select required name ="category" className={styleExpense.forminput} value ={selects} onChange={e =>setSelects(e.target.value) }>
               <option >Food</option>
               <option >Entertainment</option>
              <option >Medical</option>
              <option >Self Care</option>
               <option >Housing</option>
              <option >Travel</option>
      </select>
        </div>
{/* setting label and input field for expense Description */}
        <div className={styleExpense.expenseInfo}>
        <label className={styleExpense.formlabel}>Expense Description</label>
            <input required className={styleExpense.forminput} type="text"  name="description" />
        </div >
{/* setting label and input field for expense amount */}
        <div className={styleExpense.expenseInfo}>
        <label className={styleExpense.formlabel}>Expense Amount</label>
            <input required className={styleExpense.forminput} type="text" name="expense" />
        </div>
{/* setting label and input field for expense Date */}
        <div className={styleExpense.expenseInfo}>
        <label className={styleExpense.formlabel}>Expense Date</label>
            <input required  className={styleExpense.forminput} type="date"  name="date" />
        </div>


    
<div className="flex gap-10 items-center">
        <div className="form-check">
        </div>
        <div className="form-check">
        </div>
        </div>
        {/* todggle add button */}
        <button className={styleExpense.newtask}>ADD</button>
        </form> : <></>}
        </div>
{/* toggle update button */}
        <div>
        {show?   <form className={styleExpense.expenseForm} onSubmit={(e) => handleSubmitUpdate(e)}>
        <div className={styleExpense.expenseInfo}>
            <label className={styleExpense.formlabel}>Expense Name</label>
            <input required className={styleExpense.forminput} defaultValue ={name} key={name} type="text"  name="name"  />
        </div>
        
       

        <div className={styleExpense.expenseInfo}>
        <label className={styleExpense.formlabel}>Expense Category</label>
            <select required name ="category" className={styleExpense.forminput}>
               <option >{categoryExpense}</option>
               <option >Entertainment</option>
              <option >Medical</option>
              <option >Food</option>
              <option >Self Care</option>
               <option >Housing</option>
              <option >Travel</option>
      </select>
        </div>
        <div className={styleExpense.expenseInfo}>
        <label className={styleExpense.formlabel}>Expense Description</label>
            <input required className={styleExpense.forminput} defaultValue ={description} key={description}  type="text"  name="description" />
        </div >

        <div className={styleExpense.expenseInfo}>
        <label className={styleExpense.formlabel}>Expense Amount</label>
            <input required className={styleExpense.forminput} defaultValue ={amountExpense}  key={amountExpense} type="text" name="expense" />
        </div>

       
<div className="flex gap-10 items-center">
        <div className="form-check">
        </div>
        <div className="form-check">
        </div>
        </div>
        <button className={styleExpense.newtask}>Update</button>   
        </form>: <></>}
        </div>
        
        <table className={styleExpense.tableStyle}>
            <thead>
                <tr className={styleExpense.tableStyleRow}>

                    <th className={styleExpense.tableStyleTH}>
                        <span className={styleExpense.tableStyleLabel}>Name</span>
                    </th>


                    <th className={styleExpense.tableStyleTH}>
                        <span className={styleExpense.tableStyleLabel}>Category</span>
                    </th>

                    <th className={styleExpense.tableStyleTH}>
                        <span className={styleExpense.tableStyleLabel}>Description</span>
                    </th>

                    <th className={styleExpense.tableStyleTH}>
                        <span className={styleExpense.tableStyleLabel}>Amount</span>
                    </th>

                    <th className={styleExpense.tableStyleTH}>
                        <span className={styleExpense.tableStyleLabel}>Date</span>
                    </th>

                    <th className={styleExpense.tableStyleTH}>
                        <span className={styleExpense.tableStyleLabel}>Delete</span>
                    </th>
                    <th className={styleExpense.tableStyleTH}>
                        <span className={styleExpense.tableStyleLabel}>Update</span>
                    </th>
                </tr>

            </thead>
            <tbody className="bg-gray-200" id="tableShow">
            </tbody>
        </table>
        </div>
    )

}

