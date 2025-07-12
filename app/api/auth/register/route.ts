import { NextRequest, NextResponse } from 'next/server';
import { ConnectToDb } from '@/lib/mongodb';
import UserModel from '@/models/userSchema';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
	try {
		const { username, email, password } = await request.json();

		if (!username || !email || !password) {
			return NextResponse.json(
				{ error: 'All fields required' },
				{ status: 400 }
			);
		}

		if (password.length < 6) {
			return NextResponse.json(
				{ error: 'Password must be at least 6 characters' },
				{ status: 400 }
			);
		}

		await ConnectToDb();

		const existingUser = await UserModel.findOne({
			$or: [{ email }, { username }],
		});
		if (existingUser) {
			return NextResponse.json(
				{ error: 'User already exists' },
				{ status: 400 }
			);
		}

		const hashedPassword = await hashPassword(password);

		const user = new UserModel({
			username,
			email,
			password: hashedPassword,
		});

		await user.save();

		return NextResponse.json(
			{ message: 'User created successfully' },
			{ status: 201 }
		);
	} catch (error) {
		console.error('Registration error:', error);
		return NextResponse.json(
			{ error: 'Registration failed' },
			{ status: 500 }
		);
	}
}
