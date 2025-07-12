import { NextResponse } from 'next/server';
import UserModel from '@/models/userSchema';
import { ConnectToDb } from '@/lib/mongodb';

export const GET = async () => {
	try {
		await ConnectToDb();
		const users = await UserModel.find();
		return NextResponse.json(
			{ message: 'Success', users },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: 'ERROR', error: err },
			{ status: 400 }
		);
	}
};

export const POST = async (req: Request) => {
	const { username, email, password } = await req.json();

	try {
		await ConnectToDb();
		const newUser = await UserModel.create({
			username,
			email,
			password,
		});

		return NextResponse.json(
			{ message: 'User created', newUser },
			{ status: 201 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: 'ERROR', error: err },
			{ status: 400 }
		);
	}
};
