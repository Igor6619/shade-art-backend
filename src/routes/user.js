import express from 'express';


let userRouter = express.Router();

userRouter.get('/show/:id', function(req, res) {
	console.log(`/show/${req.params.id}`)
});
userRouter.get('/edit/:id', function(req, res) {
	console.log(`/edit/${req.params.id}`)
});

export default userRouter;