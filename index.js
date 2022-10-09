const express = require('express');
const cors = require('cors');
require("dotenv").config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASS_KEY}@cluster0.qf4bw47.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try{
        client.connect();
        const productsCollection = client.db("jerp").collection("products");
        const usersCollection = client.db("jerp").collection("users");
        
        //load all data
        app.get('/products', async (req, res)=>{
            const result = await productsCollection.find({}).toArray();
            res.send(result);
        });
        
        //load a single data
        app.get('/productdetail/:id', async (req, res)=>{
            const id = req.params.id;
            console.log(id);
            const filter = {_id: ObjectId(id)};
            const result = await productsCollection.findOne(filter);
            res.send(result);
        });
        
        //add new user and uodate user
        app.put('/updateoradduser/:email', async (req, res)=>{
            const email = req.params.email;
            const filter = {email};
            const doc = req.body;
            const options = { upsert: true };
            const update = { $set: { doc } };
            const result = await usersCollection.updateOne(filter, update, options );
            // issue a access jot token
            const token = jwt.sign(email, process.env.JOT_SECRET_KEY);
            res.send({result, token});
        })
        
    }
    finally{
        // client.close();
    }
};

run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('hello world')
});
app.listen(port, ()=>console.log('listening to port', port));