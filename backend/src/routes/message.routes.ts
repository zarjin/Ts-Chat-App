import express from 'express';
import { createMessage, getMessages } from '../controllers/message.controller';
import isAuth from '../middlewares/isAuth.middlewares';

const messageRouter = express.Router();

messageRouter.post('/create/:receiverId', isAuth, createMessage);
messageRouter.get('/get/:receiverId', isAuth, getMessages);

export default messageRouter;
