import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, generateToken } from '@/lib/auth';
import UserModel from '@/models/userSchema';
import { ConnectToDb } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: 'Email and password required' },
				{ status: 400 }
			);
		}

		await ConnectToDb();

		const user = await UserModel.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{ error: 'Invalid credentials' },
				{ status: 401 }
			);
		}

		const isValidPassword = await comparePassword(password, user.password);
		if (!isValidPassword) {
			return NextResponse.json(
				{ error: 'Invalid credentials' },
				{ status: 401 }
			);
		}

		const token = generateToken(user._id.toString());

		const response = NextResponse.json({
			message: 'Login successful',
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				role: user.role,
			},
		});

		response.cookies.set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60, // 7 days
		});

		return response;
	} catch (error) {
		console.error('Login error:', error);
		return NextResponse.json({ error: 'Login failed' }, { status: 500 });
	}
}
