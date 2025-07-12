import { NextRequest, NextResponse } from 'next/server';
import { ConnectToDb } from '@/lib/mongodb';
import QuestionModel from '@/models/questionSchema';
import UserModel from '@/models/userSchema';
import TagModel from '@/models/tagSchema';
import { getAuthenticatedUser } from '@/middleware';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
	try {
		await ConnectToDb();

		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '10');
		const search = searchParams.get('search') || '';
		const tag = searchParams.get('tag') || '';
		const sort = searchParams.get('sort') || 'newest';
		const author = searchParams.get('author') || '';

		let query: any = {};

		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } },
			];
		}

		if (tag) {
			query.tags = { $in: [tag.toLowerCase()] };
		}

		if (author) {
			const authorUser = await UserModel.findOne({ username: author });
			if (authorUser) {
				query.author = authorUser._id;
			}
		}

		let sortOption: any = {};
		switch (sort) {
			case 'oldest':
				sortOption = { createdAt: 1 };
				break;
			case 'votes':
				sortOption = { createdAt: -1 };
				break;
			case 'views':
				sortOption = { views: -1 };
				break;
			default:
				sortOption = { createdAt: -1 };
		}

		const skip = (page - 1) * limit;

		const questions = await QuestionModel.find(query)
			.populate('author', 'username reputation avatar')
			.populate('acceptedAnswer')
			.sort(sortOption)
			.skip(skip)
			.limit(limit)
			.lean();

		// Add answer count to each question
		const questionsWithCounts = await Promise.all(
			questions.map(async (question) => {
				const answerCount = await mongoose
					.model('Answer')
					.countDocuments({
						question: question._id,
					});
				return {
					...question,
					answerCount,
					voteScore:
						(question.votes?.upvotes?.length || 0) -
						(question.votes?.downvotes?.length || 0),
				};
			})
		);

		const total = await QuestionModel.countDocuments(query);

		return NextResponse.json({
			questions: questionsWithCounts,
			pagination: {
				current: page,
				pages: Math.ceil(total / limit),
				total,
				hasNext: page < Math.ceil(total / limit),
				hasPrev: page > 1,
			},
		});
	} catch (error) {
		console.error('Error fetching questions:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch questions' },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const user = await getAuthenticatedUser(request);
		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { title, description, tags } = await request.json();

		if (!title || !description) {
			return NextResponse.json(
				{
					error: 'Title and description are required',
				},
				{ status: 400 }
			);
		}

		await ConnectToDb();

		const question = new QuestionModel({
			title: title.trim(),
			description,
			tags: tags?.map((tag: string) => tag.toLowerCase().trim()) || [],
			author: user._id,
		});

		await question.save();

		// Update tag counts
		if (tags && tags.length > 0) {
			for (const tagName of tags) {
				await TagModel.findOneAndUpdate(
					{ name: tagName.toLowerCase().trim() },
					{
						$inc: { questionCount: 1 },
						$setOnInsert: { name: tagName.toLowerCase().trim() },
					},
					{ upsert: true }
				);
			}
		}

		await question.populate('author', 'username reputation avatar');

		return NextResponse.json(question, { status: 201 });
	} catch (error) {
		console.error('Error creating question:', error);
		return NextResponse.json(
			{ error: 'Failed to create question' },
			{ status: 500 }
		);
	}
}
