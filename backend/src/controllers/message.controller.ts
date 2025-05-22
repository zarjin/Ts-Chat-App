import messageModel from '../models/message.models';
import { Request, Response } from 'express';
import socketService from '../services/socket.service';

export const createMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = (req as any).user;
  const { receiverId } = req.params;
  const { content } = req.body;
  try {
    if (!receiverId || !content) {
      res.status(400).json({ message: 'Please fill in all fields' });
      return;
    }

    const newMessage = await messageModel.create({
      sender: userId,
      receiver: receiverId,
      content,
    });

    // Populate the sender and receiver fields for the response
    const populatedMessage = await messageModel
      .findById(newMessage._id)
      .populate('sender', 'username profilePicture')
      .populate('receiver', 'username profilePicture');

    // Send message via Socket.io
    socketService.sendPrivateMessage(userId, receiverId, populatedMessage);

    res.status(201).json({
      message: 'Message created successfully',
      data: populatedMessage,
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = (req as any).user;
  const { receiverId } = req.params;

  try {
    const messageData = await messageModel
      .find({
        $or: [
          { sender: userId, receiver: receiverId },
          { sender: receiverId, receiver: userId },
        ],
      })
      .sort({ createdAt: 1 })
      .populate('sender', 'username profilePicture')
      .populate('receiver', 'username profilePicture');

    res.status(200).json({ messages: messageData });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
