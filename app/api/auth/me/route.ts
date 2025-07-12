import { NextRequest, NextResponse } from 'next/server';
import { ConnectToDb } from '@/lib/mongodb';
import UserModel from '@/models/userSchema';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
	try {
		const token = request.cookies.get('token')?.value;

		if (!token) {
			return NextResponse.json(
				{ error: 'No token found' },
				{ status: 401 }
			);
		}

		const decoded = verifyToken(token);
		if (!decoded) {
			return NextResponse.json(
				{ error: 'Invalid token' },
				{ status: 401 }
			);
		}

		await ConnectToDb();

		const user = await UserModel.findById(decoded.userId).select(
			'-password'
		);
		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({ user });
	} catch (error) {
		console.error('Auth check error:', error);
		return NextResponse.json(
			{ error: 'Authentication failed' },
			{ status: 500 }
		);
	}
}
