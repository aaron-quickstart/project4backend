//    fundamental Node.js backend server
// const http = require('http');

// http.createServer((request,response) => {
//     response.write('Hello for Node.js');
//     response.end();
// }).listen(3000, () => console.log('server is running on port:3000'));

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const bcrypt = require('bcrypt');
const saltRounds = 10;

const mysql = require('mysql2');
const dataBase = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Abc120496!!',
    database: 'project4app'
});

dataBase.connect(err => {
    if (err) {
        throw err;
    }
    console.log('connection is complete');
});

app.get('/getServerInfo', (request, response) => {
    response.send('Server is running using Express!');
});

app.get('/getUsers', (request, response) => {
    dataBase.query('SELECT * FROM users_tbl;', (err, data) => {
        if (err) {
            throw err;
        }
        response.send(data);
    });
});

app.post('/login', (request, response) => {
    const { user_name, user_password } = request.body;
    const sql = "SELECT * FROM users_tbl WHERE user_name = ?";
    dataBase.query(sql, [user_name], (err, result) => {
        if (err) {
            console.log(err);
            return response.status(500).json({ message: 'internal server error' });
        }
        if (result.length > 0) {
            bcrypt.compare(user_password, result[0].user_password, (err, match) => {
                if (match) {
                    return response.status(200).json({
                        success: true,
                        message: "login successful",
                        user: result[0]
                    });
                } else {
                    response.json({
                        success: false,
                        message: "user not found",
                    });
                }
            });
        } else {
            response.json({
                success: false,
                message: "user not found",
            });
        }
    });
});

app.post('/register', (request, response) => {
    const { user_name, user_password } = request.body;
    bcrypt.hash(user_password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
            return response.status(500).json({ message: 'internal server error' });
        }
        const sql = "INSERT INTO users_tbl(user_name, user_password) VALUES (?, ?)";
        dataBase.query(sql, [user_name, hash], (err, result) => {
            if (err) {
                console.log(err);
                return response.status(500).json({ message: 'internal server error' });
            }
            if (result.insertId) {
                return response.json({
                    success: true,
                    message: "You have been registered"
                });
            } else {
                response.json({
                    success: false,
                    message: "Unable to register, try again."
                });
            }
        });
    });
});

// Fetch posts for a specific category and tab
app.get('/posts/:category/:tab', (request, response) => {
    const { category, tab } = request.params;
    const sql = "SELECT * FROM posts_tbl WHERE category = ? AND tab = ?";
    dataBase.query(sql, [category, tab], (err, result) => {
        if (err) {
            console.log(err);
            return response.status(500).json({ message: 'internal server error' });
        }
        response.json(result);
    });
});

// Create a new post
app.post('/posts', (request, response) => {
    const { category, tab, author, topic, content } = request.body;
    const sql = "INSERT INTO posts_tbl (category, tab, author, topic, content) VALUES (?, ?, ?, ?, ?)";
    dataBase.query(sql, [category, tab, author, topic, content], (err, result) => {
        if (err) {
            console.log(err);
            return response.status(500).json({ message: 'internal server error' });
        }
        if (result.insertId) {
            response.json({
                success: true,
                message: "Post created successfully",
                postId: result.insertId
            });
        } else {
            response.json({
                success: false,
                message: "Failed to create post"
            });
        }
    });
});

// Fetch comments for a specific post
app.get('/comments/:postId', (request, response) => {
    const { postId } = request.params;
    const sql = "SELECT * FROM comments_tbl WHERE post_id = ?";
    dataBase.query(sql, [postId], (err, result) => {
        if (err) {
            console.log(err);
            return response.status(500).json({ message: 'internal server error' });
        }
        response.json(result);
    });
});

// Add a comment to a post
app.post('/comments', (request, response) => {
    const { post_id, author, content } = request.body;
    const sql = "INSERT INTO comments_tbl (post_id, author, content) VALUES (?, ?, ?)";
    dataBase.query(sql, [post_id, author, content], (err, result) => {
        if (err) {
            console.log(err);
            return response.status(500).json({ message: 'internal server error' });
        }
        if (result.insertId) {
            response.json({
                success: true,
                message: "Comment added successfully",
                commentId: result.insertId
            });
        } else {
            response.json({
                success: false,
                message: "Failed to add comment"
            });
        }
    });
});

app.listen(3000, () => console.log('server is running on port:3000'));