const { urlencoded } = require("body-parser");
const express=require("express");
const multer=require("multer");

const app=express();

let port=process.env.PORT || 8000;

let posts=[];

app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));

app.get("/",function(req,res)
{
    res.render("index",{allPosts:posts});
})

app.get("/posts",function(req,res)
{
    res.render("posts",{allpostData:posts});
})

app.get("/posts/:post",function(req,res)
{
    postname=req.params.post.toLowerCase();

    let found=false;

    posts.map(item=>
    {
        if(item.title.replace(/^["\;|!@#$%^&*()]$/g," ").replace("?"," ").trim().toLowerCase()=== postname.trim())
        {
            posts.reverse();
            res.render("post",{currentPost:item,recentPost:posts.slice(0,5)});
            posts.reverse();
            found=true;
        }

    })

    if(!found)
        res.redirect("/");

})


app.get("/compose",function(req,res)
{
    res.render("compose");
})


let upload=multer({
    storage:multer.diskStorage({
        destination:function(req,file,callback)
        {
            callback(null,__dirname+"/public/uploads");
        },
        filename:function(req,file,callback)
        {   
            let filename=file.originalname.split(".");
            callback(null,filename[0]+"."+filename[1]);
        }
    })
}).single("postFile")

app.post("/compose",upload,function(req,res,next)
{   

    let file=req.file;

    if(!file)
    {   
        let error=new Error("Please provide an image");
        return next(error);
    }else{

        let post={
            title:req.body.postTitle,
            content:req.body.postContent,
            image:file.originalname
        }
        
        posts.push(post);
        res.redirect("/posts");
    }
})

app.listen(port);