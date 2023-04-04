import React, { Component } from "react";
import Head from 'next/head'
import UserNav from '../components/UserNav/UserNav'
import styles from '../styles/Home.module.scss'
import List from '../components/List/list'
import Script from 'next/script'

// creates Shopping List page
class ShoppingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allShoppingList: []
    };
  }

  // get all the shopping list from database on component load 
  async componentDidMount() {
    let userId = localStorage.getItem("loggedInUserId");
    let response = await fetch('/api/shoppinglist/' + userId);
    let data = await response.json(); 
    this.setState({
      allShoppingList: data
    });  
  }

  render() {
    const { allShoppingList } = this.state;
    return (<div className={styles.homecover}>
       <Head>
         <title>Expense Tracker</title>
         <meta name="description" content="Manage and visualize your expenses" />
        <link rel="icon" href="/favicon.png" />
         <Script  />
       </Head>
       <main className={styles.mainHome}>
           <div className='maincontainer'>
             <UserNav />
             <List data={allShoppingList}/>
           </div>
       </main>
     </div>)
  }
}
export default ShoppingList;
