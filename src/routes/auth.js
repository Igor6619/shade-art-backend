import express from 'express';
import multer from 'multer';


let authRouter = express.Router();
const upload = multer();


authRouter.post('/registration', upload.none(), function(req, res) {

    console.log(req.body)
});

authRouter.post('/login', function(req, res) {
    console.log(`/login/${req.params.id}`)
});

authRouter.get('/logout', function(req, res) {
    console.log(`/logout/${req.params.id}`)
});


export default authRouter;