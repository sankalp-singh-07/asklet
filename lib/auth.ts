import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const hashPassword = async (password: string): Promise<string> => {
	return bcrypt.hash(password, 12);
};

export const comparePassword = async (
	password: string,
	hashedPassword: string
): Promise<boolean> => {
	return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string): string => {
	return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): any => {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		return null;
	}
};
