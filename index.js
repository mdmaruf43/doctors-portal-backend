const express = require('express');
const cors = require('cors');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true });

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
}

app.get('*', (request, response) => {
	response.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.get('/allAppointmentInformation', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("doctorsPortalDB").collection("appointmentInformation");
        collection.find().toArray((err, documents) => {
            if(err){
                console.log(err)
                res.status(500).send({message: err});
            }
            else{
                res.send(documents);
            }
        });
        client.close();
    });
});

app.post('/appointmentInformation', (req, res) => {
    const appointmentDetailsInformation = req.body;
    appointmentDetailsInformation.appointmentTime = new Date();
    console.log(appointmentDetailsInformation);
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("doctorsPortalDB").collection("appointmentInformation");
        collection.insertOne(appointmentDetailsInformation, (err, result) => {
            if(err){
                console.log(err)
                res.status(500).send({message: err});
            }
            else{
                res.send(result)
            }
        });
        client.close();
    });
})

app.get('/products', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find().toArray((err, documents) => {
            if(err){
                console.log(err)
                res.status(500).send({message: err});
            }
            else{
                res.send(documents);
            }
        });
        client.close();
    });
});

app.get('/product/:key', (req, res) => {
    const key = req.params.key;
    // const name = users[id];
    // console.log(requset.query.sort);
    // response.send({id, name});
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({key}).toArray((err, documents) => {
            if(err){
                console.log(err)
                res.status(500).send({message: err});
            }
            else{
                res.send(documents[0]);
            }
        });
        client.close();
    });
})


app.post('/getProductByKey', (req, res) => {
    const key = req.params.key;
    const productKeys = req.body;
    //console.log(productKeys);
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({key: {$in: productKeys}}).toArray((err, documents) => {
            if(err){
                console.log(err)
                res.status(500).send({message: err});
            }
            else{
                res.send(documents);
            }
        });
        client.close();
    });
})


app.post('/addProduct', (req, res) => {
    //save to database
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.insert(product, (err, result) => {
            if(err){
                console.log(err)
                res.status(500).send({message: err});
            }
            else{
                res.send(result.ops[0]);
            }
        });
        client.close();
    });
})

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Listing to port 4000'));