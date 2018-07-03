var express = require("express");
var app = express();
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var expressSanitizer = require("express-sanitizer");
// APP CONFIG
mongoose.connect("mongodb://localhost/BlogApp");

app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());

// MONGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body: String,
    created: { type:Date, default: Date.now }
});
var blog = mongoose.model("blog",blogSchema);

// RESTful ROUTEs
app.get("/",function(req,res){
    res.redirect("/blogs");
});
// INDEX ROUTE
app.get("/blogs",function(req,res){
    blog.find({},function(err,blog){
        if(err){
            console.log(err);
        } 
        else{
            res.render("index",{blogs:blog});
        }
    });
   
});
// NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
});
// CREATE ROUTE


app.post("/blogs",function(req,res){
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    // create blog
    
    blog.create(req.body.blog, function(err,data){
        if(err){
            res.render("/blogs/new");
        }
        else{
            res.redirect("/blogs");
        }
        
    });
    // rediret
});
// SHOW ROUTE
app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            // res.send("he");
            res.render("show",{blog:foundBlog});
        }
        
    });
});
// EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    
    blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{ blog:foundBlog });
        }
    });
});
// UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }   else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }   else{
            res.redirect("/blogs");

        }
    });
});
// 

app.get("*",function(req,res){
    res.render("err");
});



// LISTEN
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running!");
});
