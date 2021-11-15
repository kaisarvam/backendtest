const express = require('express')
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json());

//Database Connections
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.zsdqs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("Lapel-Pin");
        const productCollection = database.collection("products");
        const orderCollection = database.collection("myOrders");
        const userCollection = database.collection("users");
        const reviewCollection = database.collection("reviews");

        //Create and showing reviews

        app.get('/reviews', async (req, res) => {

            const cursor = reviewCollection.find({});
            
            const products = await cursor.toArray();
            res.send(products);
        })

        app.post('/reviews', async (req, res) => {
            console.log(req.body)
            const product = req.body;
            const result = await reviewCollection.insertOne(product);
            res.send(result)
        });

        // Create and showing product
        app.get('/products', async (req, res) => {

            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        app.post('/products', async (req, res) => {
            console.log(req.body)
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result)
        });

        //myOrder
        app.get('/myOrder', async (req, res) => {
            const cursor = orderCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        app.post('/myOrder', async (req, res) => {
            console.log(req.body)
            const product = req.body;
            const result = await orderCollection.insertOne(product);
            res.send(result)
        });


        //Users
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.put('/users', async (req, res) => {
            const user = req.body;
            console.log('put', user);
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        //single item

        app.get('/myOrder/:email', async (req, res) => {
            console.log(req.params.email);

            const result = await orderCollection.find({ email: req.params.email }).toArray();
            res.send(result);
        })



        //delete 

        app.delete('/myOrder/:id', async (req, res) => {
            console.log(req.params.id)
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);

        })


        //Admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);

        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await userCollection.findOne(query);
            let isAdmin = false;

            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.send({ admin: isAdmin })
            //hlw

        })


    } finally {
        //. await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Doctors Portal!')
})
app.get('/hello', (req, res) => {
    res.send('Hello gello')
})
app.listen(port, () => {
    console.log('My port is', port)
})
