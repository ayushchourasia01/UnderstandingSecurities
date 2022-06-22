//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-ayush:Test123@cluster0.ohodlct.mongodb.net/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = mongoose.model("User", userSchema);



app.get("/",function(req,res){
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/login",function(req,res){
    res.render("login");
});


app.listen(3000,function(){
    console.log("server started at port 3000");
});

app.post("/register", function(req,res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(function(err){
            if(err){
                console.log(err);
            } else {
                res.redirect("/");
            }
        });
    });
    
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            alert("User not Found!!")
        } else {
            if(foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result===true){
                        res.render("secrets");
                    } else 
                    {
                        res.send("Wrong Password!!")
                    }
                }); 
            }
        }
    });
});