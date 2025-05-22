import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';

import connectDB from './configs/connectDB.config';
import socketService from './services/socket.service';

import authRouter from './routes/auth.routes';
import messageRouter from './routes/message.routes';
import userRouter from './routes/user.routes';

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Initialize Socket.io
socketService.initialize(server);

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/users', userRouter);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
