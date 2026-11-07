require('dotenv').config();
const app = require('./app');
const { db } = require('./src/config/firebase');
const port = Number(process.env.PORT || 7000 );


if (!db) throw new Error('Firebase initialization failed. Verify your credentials and configuration.');
app.listen(port, () => console.log(`\n💧[SERVER RUNNING] Toya backend is live on port ${port}`));