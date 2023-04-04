const { connectToDatabase } = require('../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;
const USER_DB_NAME = 'users';
// import { authenticated } from "../../helpers/authenticated";

import { secret } from "../../helpers/secret";
import { verify } from "jsonwebtoken";

export default async function handler(req, res) {
    switch (req.method) {        
        case 'GET': {
            return userBlogs(req, res);
        }
    }
}

async function userBlogs(req, res) {
    verify(req.headers.authorization, secret, async function(err, decoded) {
      if(!err && decoded){
        return res.status(200).json({message:"SENDING BLOG LISTS"});
      }
      else {
        res.status(500).json({message:"User not authentication"});
      }
  });
}