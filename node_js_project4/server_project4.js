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

const mysql = require('mysql2');
const dataBase = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Abc120496!!',    
        database: 'project4app'
    }
)

dataBase.connect(err => {
    if(err)
    {
        throw err;
    }
    console.log('connection is complete');

})
// app.get('/getServerInfo' , (request , response) =>
// {
//     response.send('Server is running running using Express!');
// })

// app.get('/getUsers' , (request, response)=> {
//     dataBase.query('select * from users_tbl;' , (err , data) => {
//         if(err)
//         {
//             throw err;
//         }
//         response.send(data);
//     })
// })

app.post('/login' , (request , response) => {
    const {user_name, user_password} = request.body;  // variable names of the form inputs from the log in
    console.log(user_name)
    console.log(user_password)

    const sql = " select * from users_tbl where user_name = ? and user_password = ?";
    dataBase.query(sql , [user_name , user_password] , (err ,result) => {
        if(err)
        {
            console.log(err);
            return response.status(500).json({message: 'internal server error'});
        }
        if(result.length > 0)
        {
            response.json(
                {
                    message: "login successful",
                    user: result[0]
                }
            )
        }
        else
        {
            response.json(
                {
                    message: "user not found",
                }
            )
        }
    })
}) 


app.post('/register' , (request , response) => {
    const {user_name, user_password} = request.body;  // variable names of the form inputs from the log in
    console.log(user_name)
    console.log(user_password)

    const sql = " select * from users_tbl where user_name = ? and user_password = ?";
    dataBase.query(sql , [user_name , user_password] , (err ,result) => {
        if(err)
        {
            console.log(err);
            return response.status(500).json({message: 'internal server error'});
        }
        if(result.length > 0)
        {
            response.json(
                {
                    message: "register successful",
                    user: result[0]
                }
            )
        }
        else
        {
            response.json(
                {
                    message: "user not found",
                }
            )
        }
    })
}) 


app.listen(3000, () => console.log('server is running on port:3000'));