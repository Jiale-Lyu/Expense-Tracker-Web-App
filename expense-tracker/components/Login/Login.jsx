import Head from 'next/head'
import styles from '../../styles/Home.module.scss'
import style from '../../styles/allStyles.module.scss'
import Link from 'next/link';
import { useState } from 'react';
import Router from "next/router";
import MessageToast from '../MessageToast/MessageToast';

// exporting default Login component
export default function Login() {

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [invalid_user, setUserCredential] = useState('');

  // function to login user
  const handleUserLogin = async (e) => {
    e.preventDefault();

    // reset error and message
    setError('');
    setMessage('');

    // input fields null check
    if (!loginEmail || !loginPassword) return setError('All fields are required');

    // post structure
    let loginUser = {
        loginEmail,
        loginPassword
    };

    // save the post
    let response = await fetch('/api/userAuth', {
      method: 'POST',
      body: JSON.stringify(loginUser),
    });
   // get the response data
    let res= (await response.json());
  
    if (res.success){
      localStorage.setItem('loggedInUserId', res.user_id);
      localStorage.setItem('userName', res.name);
      localStorage.setItem('userEmail', res.email);
      Router.push("/home");
    }
    else {
      setUserCredential(true)
    }
};

  return (
    <div className={styles.container}>
      <Head>
        <title>Expense Tracker</title>
        <meta name="description" content="Manage and visualize your expenses" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Error message pops up when invalid credentials are given for user */}
      {
        invalid_user ? <MessageToast displayMessage={"Invalid Credentials"} /> : <div/>
      }
      {/* Login component to get the user details */}
        <div className={style.newlogform}>
          <h2> Login </h2>
          <form onSubmit={(e) => handleUserLogin(e)} id="register-user-form">
                <div>
                    <label className={style.formLabel}>Email ID</label>
                    <input name="loginEmail" 
                      className={style.formInput}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@example.com"  
                      pattern="[a-z0-9._%+-]+@[a-z.-]+\.[a-z]{2,}$"
                      type="text" required />
                </div>    
                <div> 
                    <label className={style.formLabel}>Password</label>
                    <input name="loginPassword" 
                    className={style.formInput}
                    onChange={(e) => setLoginPassword(e.target.value)} 
                    type="password" required />
                </div>   
            <button className={style.newlog} type="submit">Login</button>
            <span className="subtle-text"> Do not have an account ? </span> <Link className="link-decor" href="/register"> Register </Link>          
          </form>
        </div>
    </div>
    
  )
}
