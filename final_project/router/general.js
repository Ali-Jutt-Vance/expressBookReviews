const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

// Registering a new user is handled in auth_users.js, not here

// Task 1: Get list of all books
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(JSON.stringify(books[isbn], null, 4));
});

// Task 3: Get books by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let result = [];
  Object.keys(books).forEach(key => {
    if (books[key].author === author) result.push(books[key]);
  });
  return res.status(200).send(JSON.stringify(result, null, 4));
});

// Task 4: Get books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let result = [];
  Object.keys(books).forEach(key => {
    if (books[key].title === title) result.push(books[key]);
  });
  return res.status(200).send(JSON.stringify(result, null, 4));
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
