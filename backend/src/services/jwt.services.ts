import jwt from 'jsonwebtoken';

export const generateToken = (userId: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
  return token;
};
export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  return decoded;
};
