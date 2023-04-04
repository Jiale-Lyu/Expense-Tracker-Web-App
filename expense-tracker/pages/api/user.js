const { connectToDatabase } = require('../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;
const USER_DB_NAME = 'users'

export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getUsers(req, res);
        }

        case 'POST': {
            return addUser(req, res);
        }

    }
}

// Getting all users from database
async function getUsers(req, res) {
    try {
        let { db } = await connectToDatabase();
        let posts = await db
            .collection(USER_DB_NAME)
            .find({})
            .sort({ published: -1 })
            .toArray();
        return res.json({
            message: JSON.parse(JSON.stringify(posts)),
            success: true,
        });
    } catch (error) {
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

// Register new user and save in database
async function addUser(req, res) {
    try {
        let { db } = await connectToDatabase();
        let newUserEmail = JSON.parse(req.body).email;
        let currentUser = await db
            .collection(USER_DB_NAME)
            .findOne({ email: newUserEmail })
        if(!currentUser){ 
            await db.collection(USER_DB_NAME).insertOne(JSON.parse(req.body));
            return res.json({
                message: 'User registered successfully',
                success: true,
            });
        }
        else{
            return res.json({
                message: 'User Already Exists',
                success: false,
            });
        }
    } catch (error) {
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}