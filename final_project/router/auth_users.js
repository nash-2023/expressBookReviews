const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60});

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const bid = req.params.isbn;
  const username = req.session.authorization.username;
  // return res.status(200).send(`Welcome, ${username}!`);
  const bookKeys = Object.keys(books);
  if(bid in bookKeys){
    let rev = req.body.review;
    if(rev) {
      let revObj = {[username]:rev};
      // books[bid]["reviews"]=
      if(books[bid]["reviews"][username]){
        books[bid]["reviews"][username]= rev;
        return res.status(200).send("review successfully Updated");
      }else{
        
        Object.assign(books[bid]["reviews"], revObj);
        return res.status(200).send("review successfully Created");
      }
  }else {
    return res.status(300).json({message: "No Review"})
}

  }else {
    return res.status(300).json({message: "ISBN not Existed"})
}  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const bid = req.params.isbn;
  const username = req.session.authorization.username;
  const bookKeys = Object.keys(books);
  if(bid in bookKeys){
      if(books[bid]["reviews"][username]){
        delete books[bid]["reviews"][username];
        return res.status(200).send("review successfully Deleted");
      }else{
        return res.status(300).json({message: "No Review exist"})
      }
  }else {
    return res.status(300).json({message: "ISBN not Existed"})
}  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
