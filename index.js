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
                res.send(result.ops[0])
            }
        });
        client.close();
    });
})

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Listing to port 4000'));