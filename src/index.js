import express from 'express';
import mongoose from 'mongoose';
import userRouter from '#routes/user.js';
import DotenvFlow from 'dotenv-flow';
DotenvFlow.config() 

let app = express();
console.log(process.env.DATABASE_PORT)
app.use('/user/', userRouter)
app.get('/', function(req, res) {
	res.send('hello world');
});

app.listen(3000, function() {
	console.log('running on port: 3000!');
});

app.use(function(req, res) {
	res.status(404).send('not found');
}); 