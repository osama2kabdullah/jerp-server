const express = require('express');
const cors = require('cors');
require("dotenv").config();
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