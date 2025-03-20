const express = require('express')
const { MongoClient } = require("mongodb")
const app = express()
const cors = require("cors")
require('dotenv').config()

const URL = process.env.MONGODB_URI

app.use(cors())
app.use(express.json())

app.get("/getpost",async (req,res)=>{
    await MongoClient.connect(URL,{useUnifiedTopology:true},async function(err,client){
        const mydb = client.db()
        let output = await mydb.collection("mypost").find().toArray()
        res.status(200).json(output)
        client.close()
        res.end()
    })
})

app.get("/addpost",async (req,res)=>{
    await MongoClient.connect(URL,{useUnifiedTopology:true},async function(err,client){
        const mydb = client.db()
        let output = await mydb.collection("mypost").insertOne({data:req.query.data,time:req.query.time})
        res.status(200).send("success")
        client.close()
        res.end()
    })
})

app.post("/views",async (req,res)=>{
    await MongoClient.connect(URL,{useUnifiedTopology:true},async function(err,client){
        const mydb = client.db()
        await mydb.collection("users").updateOne({key:200},{ $inc: { userlength: 1 } })
        res.status(200).send("ok")
        client.close()
        res.end()
    })
})

app.get("/getviews", async (req,res)=>{
    await MongoClient.connect(URL,{useUnifiedTopology:true},async function(err,client){
        const mydb = client.db()
        const data = await mydb.collection("users").find().toArray()
        client.close()
        res.send(data);
        res.end()
    })
})


app.post("/codebase", async (req,res)=>{
   await MongoClient.connect(URL,{useUnifiedTopology:true}, async function(err,client){
       const mydb = client.db();
       await mydb.collection("supercode").insertOne({time:req.body.time,program:req.body.program,title:req.body.title,note:req.body.note})
       res.send({msg:"thank for your code"});
       client.close();
       res.end();
   })
})

app.get("/sourcecode", async (req,res)=>{
    await MongoClient.connect(URL,{useUnifiedTopology:true},async function(err,client){
        const mydb = client.db()
        const data = await mydb.collection("supercode").find().toArray()
        client.close()
        res.send(data);
    })
})

app.get("/pro/:id",(req,res)=>{
    res.send(req.params.id)
})

app.post("/newImages",async (req,res)=>{
    await MongoClient.connect(URL,{useUnifiedTopology:true},async function(err,client){
        const mydb = client.db()
        await mydb.collection("myimages").updateOne({id:"root"},{$push:{imageUrl:req.body.URL}})
        .then(()=>res.send("success"))
        .catch(err=>res.send(JSON.stringify({ERROR:err,text:"error"})))
        client.close()
        res.end()
    })
})

app.get("/getImages",async (req,res)=>{
    await MongoClient.connect(URL,{useUnifiedTopology:true},async function(err,client){
        const mydb = client.db()
        await mydb.collection("myimages").find().toArray()
        .then((data)=>{
            res.send(data)
        })
        .catch(err=>res.send(JSON.stringify({ERROR:err,text:"error"})))
        .finally(()=>{
            client.close()
            res.end()
        })
      
    })
})
  
app.get("/static",async (req,res)=>{
    if(req.query.username=="admin" && req.query.passwd=="superuserdo"){
        res.sendFile(__dirname+"/public/image.html")
    }
    else{
        res.send("<h2 style='color:green'>ACCESS DENIED</h2>")
        console.log(req.query.username,req.query.passwd);
    }
})

app.listen(process.env.PORT || 3001,()=>console.log("server running..."))

