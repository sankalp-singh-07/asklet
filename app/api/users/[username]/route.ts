import { NextRequest, NextResponse } from 'next/server';
import { ConnectToDb } from '@/lib/mongodb';
import UserModel from '@/models/userSchema';
import QuestionModel from '@/models/questionSchema';
import AnswerModel from '@/models/answerSchema';

export async function GET(
	request: NextRequest,
	{ params }: { params: { username: string } }
) {
	try {
		await ConnectToDb();

		const user = await UserModel.findOne({
			username: params.username,
		}).select('-password');

		if (!user) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 }
			);
		}

		// Use user._id.toString() or just user._id without .lean()
		const questionCount = await QuestionModel.countDocuments({
			author: user._id,
		});
		const answerCount = await AnswerModel.countDocuments({
			author: user._id,
		});
		const acceptedAnswers = await AnswerModel.countDocuments({
			author: user._id,
			isAccepted: true,
		});

		const recentQuestions = await QuestionModel.find({ author: user._id })
			.sort({ createdAt: -1 })
			.limit(5)
			.select('title createdAt views');

		const recentAnswers = await AnswerModel.find({ author: user._id })
			.populate('question', 'title')
			.sort({ createdAt: -1 })
			.limit(5)
			.select('createdAt isAccepted question');

		return NextResponse.json({
			user,
			stats: {
				questionCount,
				answerCount,
				acceptedAnswers,
				reputation: user.reputation,
			},
			recentQuestions,
			recentAnswers,
		});
	} catch (error) {
		console.error('Error fetching user profile:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch user profile' },
			{ status: 500 }
		);
	}
}
