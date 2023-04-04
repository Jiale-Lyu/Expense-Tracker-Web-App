import Head from 'next/head'
import UserNav from '../components/UserNav/UserNav'
import styles from '../styles/Home.module.scss'
import Link from 'next/link';
import Table from '../components/Expense/readExpenseTable'

import UpdateTable from '../components/Expense/updateExpenseForm'

import Expenseform from '../components/Expense/addExpenseForm'
import { useSelector , useDispatch } from 'react-redux';
import { toggleChangeAction , deleteAction} from '../redux/reducer';
import { deleteUser , getUsers} from '../lib/helper';
import { useQueryClient  } from 'react-query';
import { useState } from 'react';

import styleExpense from '../styles/Expense.module.scss'

export default function Home() {

  const visible = useSelector((state) => state.app.client.toggleForm)

  

  const deleteId = useSelector(state => state.app.client.deleteId)
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  // const userName = localStorage.getItem("userName");
  const handler= () =>{
   dispatch(toggleChangeAction())
  }

  const deleteHandler = async () =>{
    if(deleteId){
      await deleteUser(deleteId)
      await queryClient.prefetchQuery('users', getUsers)
      await dispatch(deleteAction(null))
    }
    
  }
  const cancelHandler = async() =>{

    console.log("cancel")
    await dispatch(deleteAction(null))

  }


  return (
    <div className={styles.homecover}>
      <Head>
        <title>Expense Tracker</title>
        <meta name="description" content="Manage and visualize your expenses" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className={styles.mainHome}>
        <div className='maincontainer'>
          <UserNav />

          <div className={ styleExpense.container}>

      
        
         
            <div className={ styleExpense.containerTable}>
            <Table></Table>
      
            </div>
        
         <div>
          {/* <UpdateTable></UpdateTable> */}
         </div>

          </div>

         

          
        </div>
      </main>
    </div>
  )
}


