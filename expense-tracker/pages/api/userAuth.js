const { connectToDatabase } = require('../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;
const USER_DB_NAME = 'users'
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { secret } from '../../helpers/secret';

export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {        
        case 'POST': 
            return loginUser(req, res);
        default:
            return res.json({
                message:'only POST supported',
                success: false,
            });

    }
}

// checks the logging in user data and provides jwt token on successful login else returns error message
async function loginUser(req, res) {
    try {
        let { db } = await connectToDatabase();
        let loginEmail = JSON.parse(req.body).loginEmail;
        let loginPassword = JSON.parse(req.body).loginPassword;
        let currentUser = await db
            .collection(USER_DB_NAME)
            .findOne({ email: loginEmail })
        compare(loginPassword,currentUser.password, function(err, result){
            if(!err & result){
                const claim = {loginUserEmail: currentUser.email}
                const jwt = sign(claim, secret,{ expiresIn: '1h' })
                res.setHeader('Set-Cookie','authToken='+jwt+'; Path=/')
                return res.json({
                    user_id: currentUser._id,
                    email : currentUser.email,
                    name : currentUser.name,
                    success: true
                });
            }
            else{
                return res.json({
                    message:'something went wrong',
                    success: false
                });
            }
        })
    } catch (error) {
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}