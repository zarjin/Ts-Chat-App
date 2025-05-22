import { Request, Response } from 'express';
import userModel from '../models/user.models';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Get the current user ID from the request
    const currentUserId = (req as Request & { user?: { _id: string } }).user
      ?._id;

    // Find all users except the current user
    const users = await userModel
      .find({ _id: { $ne: currentUserId } })
      .select('-password');

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
    });
  }
};
