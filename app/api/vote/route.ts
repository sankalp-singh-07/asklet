import { NextRequest, NextResponse } from 'next/server';
import { ConnectToDb } from '@/lib/mongodb';
import QuestionModel from '@/models/questionSchema';
import AnswerModel from '@/models/answerSchema';
import UserModel from '@/models/userSchema';
import { getAuthenticatedUser } from '@/middleware';

export async function POST(request: NextRequest) {
	try {
		const user = await getAuthenticatedUser(request);
		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { itemId, itemType, voteType } = await request.json();

		if (!itemId || !itemType || !voteType) {
			return NextResponse.json(
				{
					error: 'itemId, itemType (question/answer), and voteType (up/down) required',
				},
				{ status: 400 }
			);
		}

		if (!['question', 'answer'].includes(itemType)) {
			return NextResponse.json(
				{ error: 'itemType must be question or answer' },
				{ status: 400 }
			);
		}

		if (!['up', 'down'].includes(voteType)) {
			return NextResponse.json(
				{ error: 'voteType must be up or down' },
				{ status: 400 }
			);
		}

		await ConnectToDb();

		const Model = itemType === 'question' ? QuestionModel : AnswerModel;
		const item = await Model.findById(itemId).populate('author');

		if (!item) {
			return NextResponse.json(
				{ error: `${itemType} not found` },
				{ status: 404 }
			);
		}

		if (item.author._id.toString() === user._id.toString()) {
			return NextResponse.json(
				{
					error: `Cannot vote on your own ${itemType}`,
				},
				{ status: 400 }
			);
		}

		const userId = user._id.toString();
		const hasUpvoted = item.votes.upvotes.some(
			(id: any) => id.toString() === userId
		);
		const hasDownvoted = item.votes.downvotes.some(
			(id: any) => id.toString() === userId
		);

		let reputationChange = 0;
		let action = '';

		if (voteType === 'up') {
			if (hasUpvoted) {
				item.votes.upvotes = item.votes.upvotes.filter(
					(id: any) => id.toString() !== userId
				);
				reputationChange = itemType === 'question' ? -5 : -10;
				action = 'removed upvote';
			} else {
				if (hasDownvoted) {
					item.votes.downvotes = item.votes.downvotes.filter(
						(id: any) => id.toString() !== userId
					);
					reputationChange += itemType === 'question' ? 2 : 2;
				}
				item.votes.upvotes.push(user._id);
				reputationChange += itemType === 'question' ? 5 : 10;
				action = 'upvoted';
			}
		} else {
			// down
			if (hasDownvoted) {
				// Remove downvote
				item.votes.downvotes = item.votes.downvotes.filter(
					(id: any) => id.toString() !== userId
				);
				reputationChange = itemType === 'question' ? 2 : 2;
				action = 'removed downvote';
			} else {
				// Add downvote, remove upvote if exists
				if (hasUpvoted) {
					item.votes.upvotes = item.votes.upvotes.filter(
						(id: any) => id.toString() !== userId
					);
					reputationChange -= itemType === 'question' ? 5 : 10; // Remove upvote bonus
				}
				item.votes.downvotes.push(user._id);
				reputationChange -= itemType === 'question' ? 2 : 2;
				action = 'downvoted';
			}
		}

		await item.save();

		if (reputationChange !== 0) {
			await UserModel.findByIdAndUpdate(item.author._id, {
				$inc: { reputation: reputationChange },
			});
		}

		const voteScore =
			item.votes.upvotes.length - item.votes.downvotes.length;
		const userVote = item.votes.upvotes.some(
			(id: any) => id.toString() === userId
		)
			? 'up'
			: item.votes.downvotes.some((id: any) => id.toString() === userId)
			? 'down'
			: null;

		return NextResponse.json({
			message: `Successfully ${action}`,
			voteScore,
			upvotes: item.votes.upvotes.length,
			downvotes: item.votes.downvotes.length,
			userVote,
		});
	} catch (error) {
		console.error('Error voting:', error);
		return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
	}
}
