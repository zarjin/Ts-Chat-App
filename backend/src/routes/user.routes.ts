import express from 'express';
import { register, login, logout } from '../controllers/auth.controller';
import isAuth from '../middlewares/isAuth.middlewares';
import { uploadProfile } from '../middlewares/uplaod.multer.middlewre';

const router = express.Router();

router.post('/register', uploadProfile.single('profilePicture'), register);
router.post('/login', login);
router.get('/logout', isAuth, logout);

export default router;
