const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

async function verifyJWT(req, res, next){
  const authHeader = req.headers.authorization;
  console.log('inside verified JWT',authHeader) 
   try {
    if(!authHeader){
      return res.status(401).send({message: 'unauthorized access'});
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(error,decoded)=>{
      if(error){
          return res.status(403).send({message:'Forbidden access'});
      }
      req.decoded = decoded;
      console.log('decoded',decoded);
      next(); 
    })
   } catch (error) {
      console.log(error)
   }  
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xw2abv6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
        await client.connect();
        const servicesCollection = client.db("geniusCar-m66").collection('services');
        const orderCollection = client.db("geniusCar-m66").collection('order');
        
        // auth
        app.post('/login',async (req,res)=>{
          const user = req.body;
          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn : '1d'
          });
          res.send({accessToken});
        }) 
        // Services Api
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
      
        // order collection API 
        app.get('/order',verifyJWT,async(req,res)=>{
           const decodedEmail = req.decoded.email;
           const email = req.query.email;
           console.log(decodedEmail,email)
          //  const query = {};
           if(decodedEmail === email){
             const query = { email : email};
             const cursor = orderCollection.find(query);
             const orders = await cursor.toArray();
             res.send(orders);
           }else{
            res.status(403).send({message:'Forbidden access'})
           }

        })

        app.post('/order',async(req,res)=>{
          const order = req.body;
          const result = await orderCollection.insertOne(order);
          res.send(result)
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
    console.log('listening to  porting currently',port)
})