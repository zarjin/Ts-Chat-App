import express from 'express';
import { getAllUsers } from '../controllers/user.controller';
import isAuth from '../middlewares/isAuth.middlewares';

const userRouter = express.Router();

// Get all users
userRouter.get('/', isAuth, getAllUsers);

export default userRouter;
