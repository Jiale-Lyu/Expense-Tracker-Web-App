import Success from "./success"
import { useQueryClient, useMutation } from "react-query";
import { addUser } from "../../lib/helper"
import styleExpense from '../../styles/Expense.module.scss'
// import { Dropdown } from "@nextui-org/react";

export default function AddUserForm(){
    const queryClient = useQueryClient()
    const addMutation = useMutation(addUser,{
        onSuccess: ()=>{
            console.log("Data Inserted")
        }
    })

    

    const handleSubmit =(e)=>{
        e.preventDefault();
        if(e.currentTarget.length==0)return console.log("Dont have form data")
        let userId = localStorage.getItem("loggedInUserId");
        const model ={
            name:e.currentTarget[0].value,
            userId,
            category:e.currentTarget[1].value,
            description:e.currentTarget[2].value,
            expense:e.currentTarget[3].value,
            date:e.currentTarget[4].value,
        }
        addMutation.mutate(model)
       

    }


if(addMutation.isLoading) return<div>Loading!</div>

if(addMutation.isSuccess) return <Success messsage={"Added Successfully"}></Success>
return(
    <div>
        <form className={styleExpense.expenseForm} onSubmit={(e) => handleSubmit(e)}>

        

        <div className={styleExpense.expenseInfo}>
            <label className={styleExpense.formlabel}>EXPENSE NAME</label>
            <input  className={styleExpense.forminput} type="text"  name="name"  />
        </div>
        
        <div className={styleExpense.expenseInfo}>
        <label className={styleExpense.formlabel}>EXPENSE CATEGORY</label>
            <input  className={styleExpense.forminput} type="text"  name="category" />
        </div>

        <div className={styleExpense.expenseInfo}>
        <label className={styleExpense.formlabel}>EXPENSE DESCRPTION</label>
            <input className={styleExpense.forminput} type="text"  name="description" />
        </div >

        {/* <div>
            <Dropdown>
                <Dropdown.Button flat>Trigger</Dropdown.Button>
                <Dropdown.Menu aria-label="Static Actions">
                    <Dropdown.Item key="food">Food</Dropdown.Item>
                    <Dropdown.Item key="entertainment">Entertainment</Dropdown.Item>
                    <Dropdown.Item key="medical">Medical</Dropdown.Item>
                    <Dropdown.Item key="selfcare">Self care</Dropdown.Item>
                    <Dropdown.Item key="housing">Housing</Dropdown.Item>
                    <Dropdown.Item key="travel">Travel</Dropdown.Item>
                    <Dropdown.Item key="saving">Saving</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div> */}

        <div className={styleExpense.expenseInfo}>
        <label className={styleExpense.formlabel}>EXPENSE AMOUNT</label>
            <input className={styleExpense.forminput} type="text" name="expense" />
        </div>

        <div className={styleExpense.expenseInfo}>
        <label className={styleExpense.formlabel}>EXPENSE DATE</label>
            <input  className={styleExpense.forminput} type="date"  name="date" />
        </div>


<div className="flex gap-10 items-center">
        <div className="form-check">
        </div>
        <div className="form-check">
        </div>
        </div>
        <button className={ styleExpense.buttonAdd}>ADD</button>
        </form>

        
        </div>
    )

}