const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const Object = new MongoClient('');

require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// username : user03
// password : jN2BVxlRnkDE6YaJ
// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xw2abv6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
        await client.connect();
        const servicesCollection = client.db("geniusCar-m66").collection('services');
        app.get('/service', async(req,res)=>{
          const query = {};
          const cursor = servicesCollection.find(query);
          const services = await cursor.toArray();
          res.send(services);
        })
        app.get('/service/:id', async(req,res)=>{
             const id = req.params.id;
             const query = {_id: new ObjectId(id)};
             const service = await servicesCollection.findOne(query);
             res.send(service);
        })
        // post API
        app.post('/service',async(req,res)=>{
          const newService = req.body;
          const result = await servicesCollection.insertOne(newService);
          res.send(result);
        })
        // Delete API
        app.delete('/service/:id',async(req,res)=>{
          const id = req.params.id;
          const query = {_id: new ObjectId(id)}
          const result = await servicesCollection.deleteOne(query);
          res.send(result);
        })
       
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('running genius server side');
})
app.listen(port,()=>{
    console.log('listening to  porting currently')
})