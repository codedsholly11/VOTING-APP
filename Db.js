const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const connectstring = process.env.connectString;


async function connectDb(){
    await mongoose.connect(connectstring);
    console.log('database connected successfully');
}

module.exports = connectDb;