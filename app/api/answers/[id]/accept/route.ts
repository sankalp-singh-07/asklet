import { NextRequest, NextResponse } from 'next/server';
import { ConnectToDb } from '@/lib/mongodb';
import AnswerModel from '@/models/answerSchema';
import QuestionModel from '@/models/questionSchema';
import NotificationModel from '@/models/notificationSchema';
import UserModel from '@/models/userSchema';
import { getAuthenticatedUser } from '@/middleware';

// POST /api/answers/[id]/accept - Accept/unaccept answer (question author only)
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

		await ConnectToDb();

		const answer = await AnswerModel.findById(params.id).populate('author');
		if (!answer) {
			return NextResponse.json(
				{ error: 'Answer not found' },
				{ status: 404 }
			);
		}

		const question = await QuestionModel.findById(answer.question);
		if (!question) {
			return NextResponse.json(
				{ error: 'Question not found' },
				{ status: 404 }
			);
		}

		if (question.author.toString() !== user._id.toString()) {
			return NextResponse.json(
				{
					error: 'Only question author can accept answers',
				},
				{ status: 403 }
			);
		}

		// Toggle acceptance
		const isCurrentlyAccepted = answer.isAccepted;

		if (isCurrentlyAccepted) {
			// Unaccept
			answer.isAccepted = false;
			question.acceptedAnswer = null;
			await UserModel.findByIdAndUpdate(answer.author._id, {
				$inc: { reputation: -15 },
			});
		} else {
			// Unaccept any previously accepted answer
			await AnswerModel.updateMany(
				{ question: answer.question, isAccepted: true },
				{ isAccepted: false }
			);

			// Accept this answer
			answer.isAccepted = true;
			question.acceptedAnswer = answer._id;

			// Give reputation to answer author
			await UserModel.findByIdAndUpdate(answer.author._id, {
				$inc: { reputation: 15 },
			});

			// Create notification
			if (answer.author._id.toString() !== user._id.toString()) {
				await NotificationModel.create({
					recipient: answer.author._id,
					sender: user._id,
					type: 'accept',
					message: `Your answer was accepted for: "${question.title}"`,
					relatedQuestion: question._id,
					relatedAnswer: answer._id,
				});
			}
		}

		await answer.save();
		await question.save();

		return NextResponse.json({
			message: isCurrentlyAccepted
				? 'Answer unaccepted'
				: 'Answer accepted',
			isAccepted: answer.isAccepted,
		});
	} catch (error) {
		console.error('Error accepting answer:', error);
		return NextResponse.json(
			{ error: 'Failed to accept answer' },
			{ status: 500 }
		);
	}
}
