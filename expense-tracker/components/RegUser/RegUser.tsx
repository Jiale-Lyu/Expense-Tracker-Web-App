import Head from 'next/head'
import Link from 'next/link';
import style from '../../styles/allStyles.module.scss'
import MessageToast from '../MessageToast/MessageToast'
import { useState } from 'react';
import Router from "next/router";
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

// exporting default RegUser component
export default function RegUser() {
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setconfirmPassword] =useState('');
    const [error, setError] = useState('');
    const [pwdError, setPwdError] = useState('')
    const [message, setMessage] = useState('');
// handles user registration
    const handleUserRegister = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        // reset error and message
        setError('');
        setMessage('');
        
            // fields null check
        if (!name || !email || !password || !confirmpassword) 
            return setError('All fields are required');
        // check password
        else if(password != confirmpassword)
            return setPwdError('Passwords does not match');

        // post structure
        let body = {
            name,
            email,
            password,
            createdAt: new Date().toISOString(),
        };
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);

        // save the user in backend using POST
        let response = await fetch('/api/user', {
            method: 'POST',
            body: JSON.stringify(body),
        });

        // get the response data
        let data = await response.json();

        if (data.success) {
            // reset the fields
            setName('');
            setEmail('');
            setPassword('');
            // set the success message
            Router.push("/?showRegister=true");
            return setMessage(data.message);
        } else {
            // set the error message
            return setError(data.message);
        }
    };

  return (
    <div>
        <Head>
            <title>Expense Tracker</title>
            <meta name="description" content="Manage and visualize your expenses" />
            <link rel="icon" href="/favicon.png" />
        </Head>
        {/* Modal to display error message */}
        {
            error.length>0 ? <MessageToast displayMessage={error} /> : <div/>
        }
        {/* Modal to display password error message */}
        {
            pwdError.length>0 ? <MessageToast displayMessage={pwdError} /> : <div/>
        }
        {/* RegUser component with the labels and input to get the user details  */}
        <div className={style.newlogform}>
            <h2> New User Registation </h2>
            <form onSubmit={(e) => handleUserRegister(e)} id="register-user-form">
                    <div>
                        <label className={style.formLabel}>Name</label>
                        <input 
                            name="name"
                            type="text"
                            className={style.formInput}
                            onChange={(e) => setName(e.target.value)}
                            required />
                    </div>
                    <div className="mb-3">
                        <label className={style.formLabel}>Email ID</label>
                        <input 
                            name="email" 
                            type="text" 
                            className={style.formInput}
                            placeholder="name@example.com" 
                            onChange={(e) => setEmail(e.target.value)}
                            pattern="[a-z0-9._%+-]+@[a-z.-]+\.[a-z]{2,}$"
                            required />                       
                    </div>
                    <div className="mb-3">
                        <label className={style.formLabel}>Password</label>
                        <input 
                            name="password" 
                            type="password" 
                            className={style.formInput}
                            onChange={(e) => setPassword(bcrypt.hashSync(e.target.value, salt))}
                            required />                       
                    </div>
                    {/* user password is hashed and sent to database for password protection */}
                    <div className="mb-3">
                        <label className={style.formLabel}>Confirm password</label>
                        <input 
                            name="confirmpassword" 
                            type="password" 
                            className={style.formInput}
                            onChange={(e) => setconfirmPassword(bcrypt.hashSync(e.target.value, salt))}
                            required />                       
                    </div>
            <button className={style.newlog} type="submit">Register</button>
            <span>Already have an account ? </span> <Link className="link-decor" href="/"> Sign In </Link>
          </form>
        </div>
    </div>
  )
}
