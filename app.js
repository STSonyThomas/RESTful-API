//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology:true});
const articleSchema={
    title:String,
    content:String
}

const Article = mongoose.model("Article",articleSchema);

///////////////////////////////////////////////Requests Targetting all Articles///////////////////////////////////////////////

app.route("/articles")
.get((req,res)=>{
    Article.find({}).then(result=>{
        res.send(result);
    }).catch(err=>{
        console.log(err);
    })
})
.post((req,res)=>{
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    })

    newArticle.save().then(result=>{
        res.send("Successfully added");
    }).catch(err=>{
        res.send("Error something went wrong");
    })
})
.delete((req,res)=>{
    Article.deleteMany({}).then(result=>{
        res.send("Successfully deleted");
    }).catch(err=>{
        console.log(err);
        res.send(err);
    })
});

///////////////////////////////////////////////Requests Targetting all Articles///////////////////////////////////////////////

app.route("/articles/:articleTitle")
.get((req,res)=>{
    Article.findOne({title:req.params.articleTitle}).then(result=>{
        res.send(result);
    }).catch(err=>{
        res.send(err);
    })
})
.put((req,res)=>{
    Article.updateOne(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content}).then(result=>{
        res.send("Successfully updated");
    }).catch(err=>{
        res.send(err);
    })
})
.patch((req,res)=>{
    Article.updateOne(
        {title:req.params.articleTitle},
        {$set:req.body}).then(result=>{
            res.send(result);
        }).catch(err=>{
            res.send(err);
        })
})
.delete((req,res)=>{
    Article.deleteOne(
        {title:req.params.articleTitle}
    ).then(result=>{
        res.send(result);
    }).catch(err=>{
        res.send(err);
    })
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});