// Dependencies
import express from 'express';
import { initializeApp } from "firebase/app";
import { getDocs, setDoc, doc, collection } from 'firebase/firestore/lite';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
    apiKey: "AIzaSyBMQTDFzZ0eKlR9ZS9xMnC13wLxr1hviTY",
    authDomain: "ipccw2-e8950.firebaseapp.com",
    projectId: "ipccw2-e8950",
    storageBucket: "ipccw2-e8950.appspot.com",
    messagingSenderId: "491967830403",
    appId: "1:491967830403:web:9bf860df56ad2cf1f03eb6",
    measurementId: "G-7SH6SNS51Y"
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

// Function to read DB
async function getCollection(db, colName) {
  const dataCol = collection(db, colName);
  const dataSnapshot = await getDocs(dataCol);
  const DataList = dataSnapshot.docs.map(doc => doc.data());
  return DataList;
}

// Function to write an object to DB
async function addDataToCollection(db, colName, data) {
  const UUID = (new Date()).getTime();
  await setDoc(doc(db, colName, UUID.toString()), data);
}

const api = express();
api.use(express.json());

// Handling Get request for / URI
api.get('/', (req, res) => {
  res.send('Express App Running');
});

// Handling record temp
api.post('/recordGPS', async (req, res) => {    
    const Car_latitude = req.query.lat || 0;
    const Car_longitude = req.query.long || 0;
    const id = req.query.ID;

    const Car_acceleration_x = req.query.acceX || 0;
    const Car_acceleration_y = req.query.acceY || 0;
    const Car_acceleration_z = req.query.acceZ || 0;

    const Car_rotation_x = req.query.rotX || 0;
    const Car_rotation_y = req.query.rotY || 0;
    const Car_rotation_z = req.query.rotZ || 0;
  
  if (id === undefined) {
    res.send("Error: SensorID is required");
    return;
  }

  const data = {
    latitude: Car_latitude,
    longitude: Car_longitude,
    acceleration_X: Car_acceleration_x,
    acceleration_Y: Car_acceleration_y,
    acceleration_Z: Car_acceleration_z,
    rotation_X :Car_rotation_x,
    rotation_Y :Car_rotation_y,
    rotation_Z :Car_rotation_z,
    SensorID: id,
    createdAt: new Date()
  };

  try {
    await addDataToCollection(database, "sensor_data", data);
    res.send("Done");
  } catch (err) {
    res.send("Error writing to DB, Please check the API log for more details");
    console.log(err);
  }
});

// Deploying the listener
const port = process.env.PORT || 8080;
api.listen(port, () => console.log(`Express server listening on port ${port}`));
