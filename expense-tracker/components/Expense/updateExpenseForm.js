import React, { useEffect ,useState} from 'react';
import styleExpense from '../../styles/Expense.module.scss'
import style from '../../styles/allStyles.module.scss'

import { useQueryClient, useMutation } from "react-query";
import { addUser } from "../../lib/helper"
import emailjs from "emailjs-com";
import { RSC_MODULE_TYPES } from 'next/dist/shared/lib/constants';


const BASE_URL = 'https://api.exchangeratesapi.io/v1/latest?access_key=RmI38SOgJpwvcfTWHWOO33lch6eyuzeO'

 
export default function UpdateTable(){

  useEffect(()=>{
    fetch(BASE_URL)
      .then(res =>res.json() )
      .then(data => console.log(data))
  },[])









    const[show,setShow] =useState(false);
    const [name, getname] = useState("");
    const [updateMsg, getUpdateMsg] = useState(false);
    const [categoryExpense, getCategoryExpense]= useState("");
    const [description, getdescription]= useState("");
    const [amountExpense, getamountExpense]= useState("");
    const [uniqId, getUniqId]= useState("");


    // -----------------------------------------------------------------------------------------------------
    const [selects, setSelects] =useState("");
    // ===================================================================================

    // const [updateVisible, seUpdateVisible]= useState(false);

    const [firstPageLoad, setFirstPageLoad] = useState(true);
    const [clearTaskList, setClearTaskList] = useState(false);
    const [addTaskFlag, setAddTaskFlag] = useState(false);
    useEffect(()=>{
      if(clearTaskList && updateMsg){
        getUpdateMsg(false);
      }
      if(clearTaskList && addTaskFlag){
    clearInnerHTML();
      getExpense();
    setAddTaskFlag(false);
  }
  if(firstPageLoad){
      getExpense();
    setFirstPageLoad(false);
    setClearTaskList(true);
  }
  });

  const handleclick = () =>{
    setShow(!show)
  }


// const handleUpdateClick=() =>{
//   seUpdateVisible(!updateVisible)

// }

    const getUpdateTask= async(task)=>{

  
    getname(task.name);
    getCategoryExpense(task.category)
    getdescription(task.description);
    getamountExpense(task.expense)
    getUniqId(task._id);
    getUpdateMsg(true);
        
       }

    const addMutation = useMutation(addUser,{
      })

      const handleSubmit =async(e)=>{
        e.preventDefault();
        if(e.currentTarget.length==0)return console.log("Dont have form data")
        // let {name, category, description,date, status}= formData;
        let userId = localStorage.getItem("loggedInUserId");
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
      const Options = {
        method: "POST",
        body: JSON.stringify(formData),
      };
      const response = await fetch(`/api/expense`, Options);
      sendEmail(formData.category);
      console.log("response:", response);
    setAddTaskFlag(true);
    console.log("clearTaskList in add",clearTaskList);
    console.log("addTaskFlag in add",addTaskFlag);

    }


    /**
 * get total expense by userId and category
 * @param {} userId 
 * @param {*} category 
 * @returns 
 */

     async function getCurrentExpenseByCatergory(userId, category, getByMonth){
        let responseExpense;
        var date = new Date();
        let currMonth = date.getMonth() + 1;
        if(getByMonth){
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

    //   -------------------------------------------
    async function sendEmail(category) {
        let userId = localStorage.getItem("loggedInUserId");
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        //get current budget with all categories
        const responseBudget = await fetch(
          `/api/budget` + "?userId=" + userId + "&year=" + year + "&month=" + month
        );
        let budget = await responseBudget.json();
        console.log("message in helper", budget.message);
        if(budget.message.length > 0){
          let money = 0;
        await getCurrentExpenseByCatergory(userId, category,true).then(function(res){
          money = parseInt(res);
          })
        let allType = Object.keys(budget.message[0]);
          let index = 0;
        for(let i = 0; i < allType.length; i++){
          if(allType[i] == category) {
              index = i;
              break;
          }
        }
        let currBudget = parseInt(Object.values(budget.message[0])[index]);
        if (currBudget < money && currBudget != 0) {
          let email = localStorage.getItem("userEmail");
          let name = localStorage.getItem("userName");
          console.log("email:", email);
          console.log("name:", name);
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
    //   -----------------DELETE

    const deleteTask = async (task) => {
        let taskId = task._id;
        const Options = {
            method: "DELETE",
            body: taskId,
          };
        await fetch('/api/expense',Options);
        setAddTaskFlag(true);
        
      } 

    //   ===================================================
    const handleSubmitUpdate =async(e)=>{
        e.preventDefault();
        if(e.currentTarget.length==0)return console.log("Dont have form data")
        // let {name, category, description,date, status}= formData;


        const formData ={
            name:e.currentTarget[0].value,
            category:e.currentTarget[1].value,
            
            description:e.currentTarget[2].value,
            expense:e.currentTarget[3].value,
            uniqId:uniqId
            
        }

      console.log("formData:", formData);
      const Options = {
        method: "PUT",
        body: JSON.stringify(formData),
      };
      console.log("uniqId:",uniqId);
      const response = await fetch(`/api/expense`, Options);
      sendEmail(formData.category);
      console.log("response:", response);
    setAddTaskFlag(true);
    console.log("clearTaskList in add",clearTaskList);
    console.log("addTaskFlag in add",addTaskFlag);
    setShow(!show)
    }

    //   ----------------------FETCH API---
    

   const getExpense = async()=>{
    let userId = localStorage.getItem("loggedInUserId");
    const response =await fetch(`/api/expense?userId=`+userId)
    let data = await response.json();
    // console.log("Table:data:",data.message);
    await addTr(data);
}

    


 //td
 const addTr = async (data) => {
let expenseArea = document.getElementById('tableShow'); 
for (let i=0; i<data.message.length;i++) {
    expenseArea.append(await trList(data.message[i]));      
}         
}
//tr
const trList = async(data) => {
let tr = document.createElement('Tr');   
let td1 = document.createElement('Td');
td1.innerHTML = data.name;
let td2 = document.createElement('Td');
td2.innerHTML = data.category;

let td3 = document.createElement('Td');
td3.innerHTML = data.description;
let td4 = document.createElement('Td');
td4.innerHTML = data.expense;

let td5 = document.createElement('Td');
td5.innerHTML = data.date;



let td6 = document.createElement('Td');
let td6btn = document.createElement('Button');
td6btn.innerHTML = "delete";
td6btn.addEventListener('click', function() { deleteTask(data) }, false);
td6.appendChild(td6btn);


let td7 = document.createElement('Td');
let td7btn = document.createElement('Button');
td7btn.addEventListener('click', function() { getUpdateTask(data) }, false);
td7btn.innerHTML = "update";
td7.appendChild(td7btn);

// let td8 = document.createElement('Td');
// let td8btn = document.createElement('Button');
// td8btn.innerHTML = "view";
// td8btn.addEventListener('click',()=>setShow(!show));
// td8.appendChild(td8btn);
// ----------------WORKING-------------------------------------
// let td8 = document.createElement('Td');
// let td8btn = document.createElement('Button');
// td8btn.innerHTML = "view";
// td8btn.addEventListener('click',function (){setShow(!show), getUpdateTask(data) }, false);
// td8.appendChild(td8btn);

// ----------------------------------------------

let td8 = document.createElement('Td');
let td8btn = document.createElement('Button');
td8btn.innerHTML = "view";
td8btn.addEventListener('click',function (){ handleclick(), getUpdateTask(data)} );
td8.appendChild(td8btn);


tr.appendChild(td1);
tr.appendChild(td2);
tr.appendChild(td3);
tr.appendChild(td4);
tr.appendChild(td5);

tr.appendChild(td6);
tr.appendChild(td7);
tr.appendChild(td8)
return tr;
}
const clearInnerHTML = async() => {
document.getElementById('tableShow').innerHTML = '';
}
      
    return(

        // --------------------------ADD-------------



        
        <div>

          <div>
            <input type ="number"></input>

            <select>
              <option value ="Hii">Hii</option>
            </select>

          </div>

<br>
</br>
<br></br>
          <div>

          <form className={styleExpense.expenseForm}  onSubmit={(e) => handleSubmit(e)}   >
        <div className={styleExpense.expenseInfo}>
            <label className={styleExpense.formlabel}>Expense Name</label>
            <input  className={styleExpense.forminput} type="text"  name="name"  />
        </div>

        <div className={styleExpense.expenseInfo}>
        <label className={styleExpense.formlabel}>Expense Category</label>
        <select name ="category" className={styleExpense.forminput} value ={selects} onChange={e =>setSelects(e.target.value) }>
               <option >Food</option>
               <option >Entertainment</option>
              <option >Medical</option>
      </select>
        </div>

        <div className={styleExpense.expenseInfo}>
        <label className={styleExpense.formlabel}>Expense Description</label>
            <input className={styleExpense.forminput} type="text"  name="description" />
        </div >

        <div className={styleExpense.expenseInfo}>
        <label className={styleExpense.formlabel}>Expense Amount</label>
            <input className={styleExpense.forminput} type="text" name="expense" />
        </div>

        <div className={styleExpense.expenseInfo}>
        <label className={styleExpense.formlabel}>Expense Date</label>
            <input  className={styleExpense.forminput} type="date"  name="date" />
        </div>


    
<div className="flex gap-10 items-center">
        <div className="form-check">
        </div>
        <div className="form-check">
        </div>
        </div>
        <button className={styleExpense.newtask}>ADD</button>
        </form>
    
          </div>

          <div>
            {show? <form className={styleExpense.expenseForm} onSubmit={(e) => handleSubmitUpdate(e)}>
        <div className={styleExpense.expenseInfo}>
            <label className={styleExpense.formlabel}>Expense Name</label>
            <input  className={styleExpense.forminput} defaultValue ={name} key={name} type="text"  name="name"  />
        </div>
    
        <div className={styleExpense.expenseInfo}>
        <label className={styleExpense.formlabel}>Expense Category</label>
        
           
            <select name ="category" className={styleExpense.forminput}>
               <option >{categoryExpense}</option>
               <option >Entertainment</option>
              <option >Medical</option>
      </select>


        </div>

        <div className={styleExpense.expenseInfo}>
        <label className={styleExpense.formlabel}>Expense Description</label>
            <input className={styleExpense.forminput} defaultValue ={description} key={description}  type="text"  name="description" />
        </div >

        <div className={styleExpense.expenseInfo}>
        <label className={styleExpense.formlabel}>Expense Amount</label>
            <input className={styleExpense.forminput} defaultValue ={amountExpense}  key={amountExpense} type="text" name="expense" />
        </div>

       
        

<div className="flex gap-10 items-center">
        <div className="form-check">
        </div>
        <div className="form-check">
        </div>
        </div>
        <button  className={styleExpense.newtask}>UPDATE</button>   
        </form>:<></>}
         

          </div>
            
            
                

{/* ================================================================================== */}
      
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

