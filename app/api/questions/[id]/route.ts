import { NextRequest, NextResponse } from 'next/server';
import { ConnectToDb } from '@/lib/mongodb';
import QuestionModel from '@/models/questionSchema';
import AnswerModel from '@/models/answerSchema';
import { getAuthenticatedUser } from '@/middleware';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		await ConnectToDb();

		const question = await QuestionModel.findById(params.id)
			.populate('author', 'username reputation avatar joinedAt')
			.populate('acceptedAnswer');
		// Removed .lean() to fix TypeScript error

		if (!question) {
			return NextResponse.json(
				{ error: 'Question not found' },
				{ status: 404 }
			);
		}

		// Increment views
		await QuestionModel.findByIdAndUpdate(params.id, {
			$inc: { views: 1 },
		});

		// Get answers
		const answers = await AnswerModel.find({ question: params.id })
			.populate('author', 'username reputation avatar')
			.sort({ isAccepted: -1, createdAt: 1 });
		// Removed .lean() to fix TypeScript error

		// Add vote scores
		const answersWithScores = answers.map((answer) => ({
			_id: answer._id,
			content: answer.content,
			author: answer.author,
			question: answer.question,
			isAccepted: answer.isAccepted,
			createdAt: answer.createdAt,
			updatedAt: answer.updatedAt,
			votes: answer.votes,
			voteScore:
				(answer.votes?.upvotes?.length || 0) -
				(answer.votes?.downvotes?.length || 0),
		}));

		return NextResponse.json({
			question: {
				_id: question._id,
				title: question.title,
				description: question.description,
				tags: question.tags,
				author: question.author,
				acceptedAnswer: question.acceptedAnswer,
				views: question.views,
				createdAt: question.createdAt,
				updatedAt: question.updatedAt,
				votes: question.votes,
				voteScore:
					(question.votes?.upvotes?.length || 0) -
					(question.votes?.downvotes?.length || 0),
			},
			answers: answersWithScores,
		});
	} catch (error) {
		console.error('Error fetching question:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch question' },
			{ status: 500 }
		);
	}
}

// PUT /api/questions/[id] - Update question (author only)
export async function PUT(
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

		const { title, description, tags } = await request.json();

		await ConnectToDb();

		const question = await QuestionModel.findById(params.id);
		if (!question) {
			return NextResponse.json(
				{ error: 'Question not found' },
				{ status: 404 }
			);
		}

		if (
			question.author.toString() !== user._id.toString() &&
			user.role !== 'admin'
		) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		question.title = title || question.title;
		question.description = description || question.description;
		question.tags =
			tags?.map((tag: string) => tag.toLowerCase().trim()) ||
			question.tags;
		question.updatedAt = new Date();

		await question.save();
		await question.populate('author', 'username reputation avatar');

		return NextResponse.json({
			_id: question._id,
			title: question.title,
			description: question.description,
			tags: question.tags,
			author: question.author,
			acceptedAnswer: question.acceptedAnswer,
			views: question.views,
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
			votes: question.votes,
		});
	} catch (error) {
		console.error('Error updating question:', error);
		return NextResponse.json(
			{ error: 'Failed to update question' },
			{ status: 500 }
		);
	}
}

export async function DELETE(
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

		await ConnectToDb();

		const question = await QuestionModel.findById(params.id);
		if (!question) {
			return NextResponse.json(
				{ error: 'Question not found' },
				{ status: 404 }
			);
		}

		if (
			question.author.toString() !== user._id.toString() &&
			user.role !== 'admin'
		) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		await AnswerModel.deleteMany({ question: params.id });

		await QuestionModel.findByIdAndDelete(params.id);

		return NextResponse.json({ message: 'Question deleted successfully' });
	} catch (error) {
		console.error('Error deleting question:', error);
		return NextResponse.json(
			{ error: 'Failed to delete question' },
			{ status: 500 }
		);
	}
}
