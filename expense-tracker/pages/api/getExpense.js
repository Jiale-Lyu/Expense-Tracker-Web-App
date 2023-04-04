const { connectToDatabase } = require("../../lib/mongodb");
const ObjectId = require("mongodb").ObjectId;
const BUDGET_DB_NAME = "expenses";

export default async function handler(req, res) {
  // switch the methods
  switch (req.method) {
    case "GET": {
      return getExpense(req, res);
    }
  }
}

// Getting all users.
async function getExpense(req, res) {
  try {
    const { userId, category, month, year } = req.query;
    console.log("userId in getExpense:", userId);
    console.log("category in getExpense:", category);
    let { db } = await connectToDatabase();
    var str = ".*" + year + "-" + month + ".*$";
    console.log("years + month", str);
    var reg = new RegExp(str);
    let posts;
    if (category == null || month == null || year == null) {
      posts = await db
        .collection(BUDGET_DB_NAME)
        .find({ userId })
        .sort({ published: -1 })
        .toArray();
      console.log("posts in budget1", posts);
    } else {
      posts = await db
        .collection(BUDGET_DB_NAME)
        .find({ userId, category, date: { $regex: reg, $options: "i" } })
        .sort({ published: -1 })
        .toArray();
      console.log("posts in budget2", posts);
    }
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
