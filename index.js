const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const methodOverrride = require("method-override");
let port = 8081;

const path = require("path");

app.use(methodOverrride("_method"));
app.use(express.urlencoded({extended:true}));

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "/views"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta",
  port: "3307",
  password: "sounak241976"
});

// -------------------- Insert Fake Data ------------------------------

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password()
  ];
};

// let data = [];

// for(let i=1 ; i<=100 ; i++)
// {
//   data.push(getRandomUser());
// }

// --------------------------------------------------------------------

// let q = "insert into user(id , username , email , password) values ?";
// let user = ["123" , "123_newuser" , "abc@gmail.com" , "abc"];

// try
// {
//   connection.query(q , [data] , (err , result) => {
//     if(err)
//     {
//       throw err;
//     }
//     console.log(result);
//   });
// }
// catch(err)
// {
//   console.log(err);
// }

// connection.end();


// get route
app.get("/" , (req , res) => {
  // res.send("Request is working");

  let q = "select count(*) from user"
  try
  {
    connection.query(q , (err , result) => {
      if(err)
      {
        throw err;
      }
      // console.log(resul(t);
      // console.log(result[0]["count(*)"]);   // OR (result[0].key)  
      let count = result[0]["count(*)"];
      res.render("index.ejs" , {count});
      // res.redirect("/");
    });
  }
  catch(err)
  {
    console.log(err);
    res.send("Some error in DB");
  }
});

// show route
app.get("/user" , (req , res) => {
  let q = "select * from user";
  try
  {
    connection.query(q , (err , result) => {
      if(err)
      {
        throw err;
      }
      // console.log(result);
      res.render("show_users.ejs" , {result});
    });
  }
  catch(err)
  {
    console.log(err);
    res.send("Some error in DB");
  }
});

// Edit route
app.get("/user/:id/edit" , (req , res) => {
  let {id} = req.params;
  let q = `select * from user where id = '${id}'`;
  try
  {
    connection.query(q , (err , result) => {
      if(err)
      {
        throw err;
      }
      // console.log(result);
      let user = result[0];
      res.render("edit.ejs" , {user});
    });
  }
  catch(err)
  {
    console.log(err);
    res.send("Some error in DB");
  }
});

// Update route
app.patch("/user/:id" , (req , res) => {
  let {id} = req.params;
  let {password : formPass , username : newUsername} = req.body;

  let q = `select * from user where id = '${id}'`;
  try
  {
    connection.query(q , (err , result) => {
      if(err)
      {
        throw err;
      }
      // console.log(result);
      let user = result[0];
      if(formPass != user.password)
      {
        res.send("Wrong password");
      }
      else
      {
        // To update the user
        let q2 = `update user set username = '${newUsername}' where id = '${id}'`;
        connection.query(q2 , (err , result) => {
          if(err)
          {
            throw err;
          }
          res.redirect("/user");
        });
      }
    });
  }
  catch(err)
  {
    console.log(err);
    res.send("Some error in DB");
  }
});


app.listen(port , () => {
  console.log(`Listening on port ${port}`);
});

