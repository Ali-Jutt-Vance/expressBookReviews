const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  return users.filter(user => user.username === username).length > 0;
}

const authenticatedUser = (username,password)=>{
  return users.filter(user => user.username === username && user.password === password).length > 0;
}

// Task 6: Register user
regd_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({message:"Username & password required"});
  if(isValid(username)) return res.status(409).json({message:"User already exists"});
  
  users.push({username, password});
  return res.status(200).json({message:"User registered successfully"});
});

// Task 7: Login user
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if(!authenticatedUser(username, password)) return res.status(401).json({message:"Invalid credentials"});

  let accessToken = jwt.sign({data: username}, "access", {expiresIn: 3600});
  req.session.authorization = { accessToken, username };
  return res.status(200).json({message:"Login successful"});
});

// Task 8: Add/update review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if(!books[isbn]) return res.status(404).json({message:"Book not found"});

  books[isbn].reviews[username] = review;
  return res.status(200).json({message:"Review added/updated"});
});

// Task 9: Delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if(books[isbn] && books[isbn].reviews[username]){
    delete books[isbn].reviews[username];
    return res.status(200).json({message:"Review deleted"});
  }

  return res.status(404).json({message:"Review not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
