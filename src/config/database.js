const mongoose =require('mongoose');
const {GridFSBucket}=require('mongodb');

let gfsBucket;

//MongoDB connection
const connectDB= async ()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI,{
            maxPoolSize:10,
        })
        if(conn.connection.readyState===1){
            console.log("MongoDB connection is open");

            //Initialize GridFSBucket
            const db =mongoose.connection.db;
            gfsBucket=new GridFSBucket(db, {
                bucketName:'uploads'
            });
            console.log("MongoDB Connected with GridFSBucket");
        } else {
            throw new Error("MongoDB connection is not open");
        }
        
    } catch (error) {
        logger.error(`MongoDB connection error: ${err.message}`);
        process.exit(1);      
    }
}

// Retrieving GridFsBucket instance
const getGFSBUcket=()=>{
    if(!gfsBucket){
        throw new Error('GridFSBucket is not initialized');
    }
    return gfsBucket;
}

module.exports={ connectDB, getGFSBUcket};