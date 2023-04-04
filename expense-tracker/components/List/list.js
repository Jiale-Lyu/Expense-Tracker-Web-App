import { useState } from "react";
import style from '../../styles/allStyles.module.scss';
import Router from "next/router";

// exporting default List component
export default function List(mydata) {
    const [userInput, setUserInput] = useState('')
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    // handles change in input element
    const handleChange = async (e) => {
        e.preventDefault();
        setUserInput(e.target.value)
    }
    // handles adding new item to list 
    const handleSubmit = async (e) => {
        e.preventDefault();
        // input fields null check
        if (!userInput) 
          return setError('All fields are required');        
        // reset error and message
        setError('');
        setMessage('');

        const userID = localStorage.getItem('loggedInUserId');
        // post structure  
        let body = {
            "taskName": userInput,
            "status": "open"
        };
        // save the shopping item to database
        let response = await fetch('/api/shoppinglist/'+ userID, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    // get the response data
        let data = await response.json();    
        if (data.success) {
            setUserInput('');
            // set the success message
            mydata.data.message.push(data.todo)
            return setMessage(data.message);
        } else {
            // set the error message
            return setError(data.message);
        }
    }
// handles deleting an item from list 
    const handleDelete = async (todo) => {
        let taskId = todo._id;
// delete the shopping item from database
        let response = await fetch('/api/shoppinglist/'+ taskId, {
            method: 'DELETE'     
        });
        let data = await response.json();
        if(data.success){
            mydata.data.message = []
            mydata.data.message = data.tasks
            Router.push("/shoppinglist/?delete=success");
        }
    }
// handles updating task item as completed or active
    const handleComplete = async (todo) => {
        let taskId = todo._id
        let body;
        if(todo.status === 'open') {
            body = {status: 'completed'}   
        }
        else {
            body = {status: 'open'}
        }    
 // updates the shopping item in database   
        let res = await fetch('/api/shoppinglist/'+ taskId, {
            method: 'PUT',
            body: JSON.stringify(body),     
            });
        let data = await res.json();
        if(data.success){
        mydata.data.message = data.todo
        Router.push("/shoppinglist/?complete=success");
        }
    }

/* List component with the labels and input to get the list item  */
    return (
        <div>
            <div className={style.listForm}>
            <form>
                <input type='text' className={style.formTaskInput} value={userInput} placeholder='New Shopping Item' onChange={handleChange}></input>
                <button type="submit" className={style.newtask} onClick={handleSubmit}>Add</button>
            </form>  
            </div>
            <div className={style.shoppingList} id='main-task-container'>  
            <ul>
                {  
                    (mydata.data.message && mydata.data.message.length>= 1) ? mydata.data.message.map((todo,index)=> {
                        if(todo.status == 'open') {
                        return <div className={style.currentTasks}> 
                                    <ul>
                                        <li><input name='checkbox' onClick={(e) =>{
                                            e.preventDefault
                                            handleComplete(todo)}} type='checkbox' checked=''></input></li>
                                        <li name='todoName' key={index}>{todo.taskName}</li>
                                        <li><button name='delete' className={style.listDeletebtn} onClick={(e) =>{
                                            e.preventDefault
                                            handleDelete(todo)}}>X</button></li>
                                    </ul>
                                </div>
                        }
                        
                        else if(todo.status == 'completed'){
                            return <div className={style.finishedTasks}>
                                    <ul>
                                        <li><input name='checkbox' onClick={(e) =>{
                                            e.preventDefault
                                            handleComplete(todo)}} type='checkbox' checked></input></li>
                                        <li name='todoName' key={index}>{todo.taskName}</li>
                                        <li><button name='delete' className={style.listDeletebtn} onClick={(e) =>{
                                            e.preventDefault
                                            handleDelete(todo)}}>X</button></li>
                                    </ul>
                                </div>
                        }
                    }) : 'Enter a Shopping Item'
                }
            </ul>
            </div>
        </div>
    )
}
