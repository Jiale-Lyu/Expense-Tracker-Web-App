const { connectToDatabase } = require("../../lib/mongodb");
const ObjectId = require("mongodb").ObjectId;
const BUDGET_DB_NAME = "budget";

export default async function handler(req, res) {
  // switch the methods
  switch (req.method) {
    case "GET": {
      return getBudget(req, res);
    }

    case "POST": {
      return addBudget(req, res);
    }
  }
}

// Getting all users.
async function getBudget(req, res) {
  try {
  const { userId, year, month } = req.query;
  // console.log("year in getBudget api:", year);
  // console.log("month in getBudget api:", month);

    let { db } = await connectToDatabase();
    let posts;
    if (!year || !month){
      posts = await db
        .collection(BUDGET_DB_NAME)
        .find({ userId})
        .sort({ published: -1 })
        .toArray();
    }else{
      posts = await db
        .collection(BUDGET_DB_NAME)
        .find({ userId, year, month })
        .sort({ "year": -1 })
        .toArray();
    }
      
      // console.log("getBudget res in budget.js", posts);
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

// Register new user
async function addBudget(req, res) {
  try {
    let { db } = await connectToDatabase();
    let budgetInfo = JSON.parse(req.body);
    let userId = budgetInfo.userId;
    let year = budgetInfo.year;
    let month = budgetInfo.month;
    let currentUser = await db
      .collection(BUDGET_DB_NAME)
      .findOne({ userId,year,month});
    if (!currentUser) {
      console.log("insertOne!");
      await db.collection(BUDGET_DB_NAME).insertOne(budgetInfo);
      return res.json({
        message: "User budget  insert successfully",
        success: true,
      });
    } else {
      console.log("updateOne!");
      await db
        .collection(BUDGET_DB_NAME)
        .update({ userId,year,month }, { $set: budgetInfo });
      return res.json({
        message: "User budget update successfully",
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
