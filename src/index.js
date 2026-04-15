import express from 'express';
import mongoose from 'mongoose';
import userRouter from '#routes/user.js';

let app = express();

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