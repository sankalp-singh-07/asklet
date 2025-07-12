import { NextRequest, NextResponse } from 'next/server';
import { ConnectToDb } from '@/lib/mongodb';
import AnswerModel from '@/models/answerSchema';
import { getAuthenticatedUser } from '@/middleware';

// PUT /api/answers/[id] - Update answer (author only)
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

		const { content } = await request.json();

		await ConnectToDb();

		const answer = await AnswerModel.findById(params.id);
		if (!answer) {
			return NextResponse.json(
				{ error: 'Answer not found' },
				{ status: 404 }
			);
		}

		if (
			answer.author.toString() !== user._id.toString() &&
			user.role !== 'admin'
		) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		answer.content = content;
		answer.updatedAt = new Date();
		await answer.save();

		await answer.populate('author', 'username reputation avatar');

		return NextResponse.json(answer);
	} catch (error) {
		console.error('Error updating answer:', error);
		return NextResponse.json(
			{ error: 'Failed to update answer' },
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

		const answer = await AnswerModel.findById(params.id);
		if (!answer) {
			return NextResponse.json(
				{ error: 'Answer not found' },
				{ status: 404 }
			);
		}

		if (
			answer.author.toString() !== user._id.toString() &&
			user.role !== 'admin'
		) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		await AnswerModel.findByIdAndDelete(params.id);

		return NextResponse.json({ message: 'Answer deleted successfully' });
	} catch (error) {
		console.error('Error deleting answer:', error);
		return NextResponse.json(
			{ error: 'Failed to delete answer' },
			{ status: 500 }
		);
	}
}
