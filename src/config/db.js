import mongoose from 'mongoose';


let connectDB = async ()=>{
    mongoose.connect(process.env.MONGODB_URL, {
        maxPoolSize: 20,
        minPoolSize: 5,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 60000,
        connectTimeoutMS: 15000,
        retryWrites: true,
        retryReads: true,
        authSource:'admin'
    }).then(()=>{
        console.log('MongoDB connected');
        console.log(`Database: ${mongoose.connection.name}`);
    }).catch(e=>{
        console.log(`Ошибка при подключении к БД: ${e}`)
    })

}


export default connectDB

