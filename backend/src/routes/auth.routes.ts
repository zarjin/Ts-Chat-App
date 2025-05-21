import express from 'express';
import { register, login, logout } from '../controllers/auth.controller';
import isAuth from '../middlewares/isAuth.middlewares';
import { uploadProfile } from '../middlewares/uplaod.multer.middlewre';

const authRouter = express.Router();

authRouter.post('/register', uploadProfile.single('profilePicture'), register);
authRouter.post('/login', login);
authRouter.get('/logout', isAuth, logout);

export default authRouter;
