import { NextRequest, NextResponse } from 'next/server';
import { ConnectToDb } from '@/lib/mongodb';
import AnswerModel from '@/models/answerSchema';
import QuestionModel from '@/models/questionSchema';
import NotificationModel from '@/models/notificationSchema';
import { getAuthenticatedUser } from '@/middleware';

// GET /api/questions/[id]/answers - Get answers for a question
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await ConnectToDb();

		const answers = await AnswerModel.find({ question: params.id })
			.populate('author', 'username reputation avatar')
			.sort({ isAccepted: -1, createdAt: 1 })
			.lean();

		const answersWithScores = answers.map((answer) => ({
			...answer,
			voteScore:
				(answer.votes?.upvotes?.length || 0) -
				(answer.votes?.downvotes?.length || 0),
		}));

		return NextResponse.json({ answers: answersWithScores });
	} catch (error) {
		console.error('Error fetching answers:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch answers' },
			{ status: 500 }
		);
	}
}

// POST /api/questions/[id]/answers - Create new answer
export async function POST(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const user = await getAuthenticatedUser(request);
		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { content } = await request.json();

		if (!content || content.trim().length === 0) {
			return NextResponse.json(
				{ error: 'Content is required' },
				{ status: 400 }
			);
		}

		await ConnectToDb();

		const question = await QuestionModel.findById(params.id).populate(
			'author'
		);
		if (!question) {
			return NextResponse.json(
				{ error: 'Question not found' },
				{ status: 404 }
			);
		}

		const answer = new AnswerModel({
			content,
			author: user._id,
			question: params.id,
		});

		await answer.save();

		// Create notification for question author (if not self-answer)
		if (question.author._id.toString() !== user._id.toString()) {
			await NotificationModel.create({
				recipient: question.author._id,
				sender: user._id,
				type: 'answer',
				message: `${user.username} answered your question: "${question.title}"`,
				relatedQuestion: question._id,
				relatedAnswer: answer._id,
			});
		}

		await answer.populate('author', 'username reputation avatar');

		return NextResponse.json(answer, { status: 201 });
	} catch (error) {
		console.error('Error creating answer:', error);
		return NextResponse.json(
			{ error: 'Failed to create answer' },
			{ status: 500 }
		);
	}
}
