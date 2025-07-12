import { NextRequest, NextResponse } from 'next/server';
import { ConnectToDb } from '@/lib/mongodb';
import TagModel from '@/models/tagSchema';

// GET /api/tags - Get all tags with search
export async function GET(request: NextRequest) {
	try {
		await ConnectToDb();

		const { searchParams } = new URL(request.url);
		const search = searchParams.get('search') || '';
		const limit = parseInt(searchParams.get('limit') || '50');
		const sort = searchParams.get('sort') || 'popular'; // popular, alphabetical, newest

		let query: any = {};
		if (search) {
			query.name = { $regex: search, $options: 'i' };
		}

		let sortOption: any = {};
		switch (sort) {
			case 'alphabetical':
				sortOption = { name: 1 };
				break;
			case 'newest':
				sortOption = { createdAt: -1 };
				break;
			default: // popular
				sortOption = { questionCount: -1 };
		}

		const tags = await TagModel.find(query)
			.sort(sortOption)
			.limit(limit)
			.lean();

		return NextResponse.json({ tags });
	} catch (error) {
		console.error('Error fetching tags:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch tags' },
			{ status: 500 }
		);
	}
}
