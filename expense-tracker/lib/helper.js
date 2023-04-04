
// single users
import emailjs from "emailjs-com";

export async function getUser(req){
    try{
        let userId = localStorage.getItem("loggedInUserId");
        console.log("fetch:userId:",userId);
        const response =await fetch(`/api/expense?userId=`+userId)
        console.log("getExpense response:",response);
        const json = await response.json()
        return json;
    }catch(error){
        return error;
    }
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


// posting a new user
export async function addUser(formData){
    try{
      console.log("formData:", formData);
      const Options = {
        method: "POST",
        body: JSON.stringify(formData),
      };
      const response = await fetch(`/api/expense`, Options);
      sendEmail(formData.category);
      console.log("response:", response);
      const json = await response.json();
      return json;
    }catch(error){
        return error;
    }
}

// update API

export async function updateUser(userId, formData){
    try{
      sendEmail(formData.category);
        const Options ={

            method:'PUT',
            headers:{'Content-Type':"application/json"},
            body:JSON.stringify(formData)

        }
        // const response =await fetch(`${BASE_URL}/api/users?userId=${userId}`,Options)
        const json = await response.json()
        return json;


    }catch(error){
        return error;

    }
}

// delete a user

export async function deleteUser(userId){

    try{
        const Options ={

            method:'DELETE',
            headers:{'Content-Type':"application/json"},     
        }
        // const response =await fetch(`${BASE_URL}/api/users/?userId=${userId}`,Options)
        const json = await response.json()
        return json;


    }catch(error){
        return error;
    }

}