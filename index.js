//Dependencies
import express from 'express';

import { initializeApp } from "firebase/app";
import {   getDocs, updateDoc } from
'firebase/firestore/lite';
import { getFirestore, collection } from
'firebase/firestore';

import { doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCwprbdxlHVRYWOQ5kmAF7S1Qhl77bEU7E",
    authDomain: "nibm-ipc.firebaseapp.com",
    projectId: "nibm-ipc",
    storageBucket: "nibm-ipc.appspot.com",
    messagingSenderId: "117578133234",
    appId: "1:117578133234:web:019c5eb67aa76585f56a6b",
    measurementId: "G-QP112ZKY5E"
  };

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

//Function to read DB
async function getCollection(db, colName) {
const dataCol = collection(db, colName);
const dataSnapshot = await getDocs(dataCol);
const DataList = dataSnapshot.docs.map(doc => doc.data());
return DataList;
}

//Function to write to DB
async function addToCollection(db, colName) {

    const data = {
        stringExample: 'Hello, World!',
        booleanExample: true,
        numberExample: 3.14159265,
        dateExample: new Date('December 10, 1815'),
        arrayExample: [5, true, 'hello'],
        nullExample: null,
        objectExample: {
          a: 5,
          b: true
        }
    };

    const UUID = (new Date()).getTime();
    await setDoc(doc(db, colName, UUID.toString()), data);
}

//Function to write an object to DB
async function addDataToCollection(db, colName, data) {
    const UUID = (new Date()).getTime();
    await setDoc(doc(db, colName, UUID.toString()), data);
}

const api = express();
api.use(express.json());
//Handling Get request for / URI
api.get('/', (req, res) => {
    res.send('Express App Running');
});

//Handling record temp
api.post('/recordTemp', (req, res) => {
    const sensorReading = req.query.temp || 0;
    const id = req.query.ID
    const data = {
        Reading : sensorReading,
        SensorID : id,
        createdAt : new Date()
    }
    addDataToCollection(database, "TempData", data).then(
        value => {res.send("Done");}
    ).catch(
        err => {
            res.send("Error writing to DB, Please check the API log for more details");
            console.log(err);
        }
    )
});

//Deploying the listener
const port = process.env.PORT || 8080;
api.listen(port, () => console.log(`Express server listening on port
${port}`));