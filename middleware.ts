import { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';
import { ConnectToDb } from './lib/mongodb';
import UserModel from './models/userSchema';

export async function getAuthenticatedUser(request: NextRequest) {
	const token = request.cookies.get('token')?.value;

	if (!token) {
		return null;
	}

	const decoded = verifyToken(token);
	if (!decoded) {
		return null;
	}

	await ConnectToDb();
	const user = await UserModel.findById(decoded.userId);
	return user;
}
