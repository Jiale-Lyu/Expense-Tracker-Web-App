const { connectToDatabase } = require('../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;
const USER_DB_NAME = 'expenses'

export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getUsers(req, res);
        }

        case 'POST': {
                return addUser(req, res);
        }

        case 'PUT': {
            // console.log("PUT...");
            return updatePost(req, res);
        }

        case 'DELETE': {
            console.log("DELETE....");
            return deleteExpense(req, res);
        }
    }
}

// Getting all users.
async function getUsers(req, res) {


    try {
        const { userId } = req.query;
        console.log("userId in expense:", userId);
        // let userId = req.bod
        let { db } = await connectToDatabase();
        console.log("req.body(userId)",userId);
        let posts = await db
            .collection(USER_DB_NAME)
            .find({ userId })
            .sort({ published: -1 })
            .toArray();

        console.log("posts",posts);
        // setTimeout(() => {
            return res.json({
                message: JSON.parse(JSON.stringify(posts)),
                success: true,
            });
        // }, 10000);
       
    } catch (error) {
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }


}

// Register new user
async function addUser(req, res) {
    try {
        let { db } = await connectToDatabase();
        // let userId = JSON.parse(req.body).userId;
        let currData =  JSON.parse(req.body);
        console.log("currdata:",currData);
        await db.collection(USER_DB_NAME).insertOne(currData);
            return res.json({
                message: 'User expense save successfully',
                success: true,
            });
    } catch (error) {
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

async function updatePost(req, res) {
    try {
      let { db } = await connectToDatabase();
      let formdata = JSON.parse(req.body);;
      // const {uniqId} = req.query;
      let uniqId = formdata.uniqId;
      console.log("uniqId"+uniqId);
      console.log("formdata"+formdata);
      let currentTask = await db
        .collection(USER_DB_NAME)
        .findOne({ _id: ObjectId(uniqId) });
      console.log("currentTask", currentTask);
      let updateData= {
        name:formdata.name,
            category:formdata.category,
            description:formdata.description,
            expense:formdata.expense
      }
      if (currentTask) {
        await db
          .collection(USER_DB_NAME)
          .update({ _id: ObjectId(uniqId) },{$set:updateData});
        return res.json({
          message: "update Item from list",
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
async function deleteExpense(req, res) {
  try {
    let { db } = await connectToDatabase();
    let taskID = req.body;
    console.log(taskID);
    let currentTask = await db
      .collection(USER_DB_NAME)
      .findOne({ _id: ObjectId(taskID) });
    console.log("currentTask", currentTask);

    if (currentTask) {
      await db
        .collection(USER_DB_NAME)
        .deleteMany({ _id: ObjectId(taskID) });
      return res.json({
        message: "Deleted Item from list",
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