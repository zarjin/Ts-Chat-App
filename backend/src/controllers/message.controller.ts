import messageModel from '../models/message.models';
import { Request, Response } from 'express';

export const createMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId: string = (req as any).user.userId;
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

    res.status(201).json({
      message: 'Message created successfully',
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId: string = (req as any).user.userId;
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
      .populate('sender receiver');

    res.status(200).json({ messages: messageData });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
