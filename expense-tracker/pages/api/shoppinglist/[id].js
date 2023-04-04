const { connectToDatabase } = require('../../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;
const SHOPPING_LIST_DB_NAME = 'shoppingList'
const USER_DB_NAME = 'users'

export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getShoppingListForUser(req, res);            
        }

        case 'POST': {
            return addShoppingListItemForUser(req, res);
        }

        case 'PUT': {
            return editShoppingListItemByTaskId(req, res);
        }

        case 'DELETE': {
            return deleteShoppingListItemById(req, res);
        }
    }
}

// Getting all the list items from database
async function getShoppingListForUser(req, res) {
    try {
        let { db } = await connectToDatabase();
        let posts = await db
            .collection(SHOPPING_LIST_DB_NAME)
            .find({userId: req.query.id})
            .sort({ status: -1 })
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

// Creates or add new list item in database
async function addShoppingListItemForUser(req, res) {
    try {
        let { db } = await connectToDatabase();
        let userID = req.query.id;
        let currentUser = await db
            .collection(USER_DB_NAME)
            .findOne({ _id: ObjectId(userID) })
        
        let jsonBody = JSON.parse(req.body)
        jsonBody.userId = userID;
        req.body = JSON.stringify(jsonBody)

        if(currentUser) {
            let response = await db.collection(SHOPPING_LIST_DB_NAME).insertOne(JSON.parse(req.body));
            let newItem = await db.collection(SHOPPING_LIST_DB_NAME).findOne({ _id: response.insertedId })
            return res.json({
                message: 'Added Item to list',
                success: true,
                todo: newItem
            });
        }
    } catch (error) {
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

// Updates the existing list item in database
async function editShoppingListItemByTaskId(req, res) {
    try {
        let { db } = await connectToDatabase();
        let updatedTask = JSON.parse(req.body);
        let taskID = req.query.id;
        
        let currentTask = await db
            .collection(SHOPPING_LIST_DB_NAME)
            .findOne({ _id: ObjectId(taskID) })

        if(currentTask) {
            await db.collection(SHOPPING_LIST_DB_NAME).updateOne({ _id: ObjectId(taskID) }, { $set: updatedTask });
            let updatedItem = await db
                .collection(SHOPPING_LIST_DB_NAME)
                .find({userId: currentTask.userId})
                .sort({ status: -1 })
                .toArray();
            return res.json({
                message: 'Updated Item to list',
                success: true,
                todo: updatedItem
            });
        }
    } catch (error) {
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

// Deletes the selected list item from database
async function deleteShoppingListItemById(req, res) {
    try {
        let { db } = await connectToDatabase();
        let taskID = req.query.id;
        
        let currentTask = await db
            .collection(SHOPPING_LIST_DB_NAME)
            .findOne({ _id: ObjectId(taskID) })

        if(currentTask) {
            await db.collection(SHOPPING_LIST_DB_NAME).deleteMany({ _id: ObjectId(taskID) });
            let postsAfterDelete = await db
                                    .collection(SHOPPING_LIST_DB_NAME)
                                    .find({userId: currentTask.userId})
                                    .sort({ status: -1 })
                                    .toArray();            
            return res.json({
                message: 'Deleted Item from list',
                tasks: postsAfterDelete,
                success: true,
            });
        }
    } catch (error) {
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}