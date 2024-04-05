const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


  

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

let getallbooks = new Promise((resolve,reject) => {
  setTimeout(() => {resolve(books)},20000)})
// Get the book list available in the shop


public_users.get('/',function (req, res) {
  getallbooks.then((books)=>{
    res.send(JSON.stringify(books,null,4));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const id = req.params.isbn;
  getallbooks.then((books)=>{
    const bookKeys = Object.keys(books);
    if(id in bookKeys){
      res.send(books[id]);
    }else {
      return res.status(300).json({message: "ISBN not Existed"})
    }
  });
 });
  /*
  let bookswithsameid = bookKeys.filter((bid)=>{
    return bid === id
  });
  if(bookswithsameid.length > 0){
    res.send(books[id]);
  }else {
    res.status(403).json({message: "ISBN not Existed"})
  }
  */
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const requestedAuthor = req.params.author;
  getallbooks.then((books)=>{
    const bookKeys = Object.keys(books);
  const result = [];
  bookKeys.forEach((bid)=>{
    if (books[bid].author == requestedAuthor){
      result.push(books[bid]);
    }
  });
  if(result.length > 0){
    // ksameAuthor.forEach((k)=>{res.send(books[k])});
    res.send(JSON.stringify(result,null,4));
  }else {
    res.status(300).json({message: "Author not Exist"});
  }
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const requestedTitle = req.params.title;
  getallbooks.then((books)=>{
    const bookKeys = Object.keys(books);
    let ksameTitle =bookKeys.filter((bid)=>{
      return books[bid].title == requestedTitle
    });
    if(ksameTitle.length > 0){
      ksameTitle.forEach((k)=>{res.send(books[k])});
    }else {
      res.status(300).json({message: "Title not Exist"});
    }
  });
});

  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const id = req.params.isbn;
    res.send(books[id]["reviews"]);
  
});

module.exports.general = public_users;
