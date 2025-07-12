import { NextRequest, NextResponse } from 'next/server';
import { ConnectToDb } from '@/lib/mongodb';
import NotificationModel from '@/models/notificationSchema';
import { getAuthenticatedUser } from '@/middleware';

export async function GET(request: NextRequest) {
	try {
		const user = await getAuthenticatedUser(request);
		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '20');
		const unreadOnly = searchParams.get('unreadOnly') === 'true';

		await ConnectToDb();

		let query: any = { recipient: user._id };
		if (unreadOnly) {
			query.isRead = false;
		}

		const skip = (page - 1) * limit;

		const notifications = await NotificationModel.find(query)
			.populate('sender', 'username avatar')
			.populate('relatedQuestion', 'title')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean();

		const total = await NotificationModel.countDocuments(query);
		const unreadCount = await NotificationModel.countDocuments({
			recipient: user._id,
			isRead: false,
		});

		return NextResponse.json({
			notifications,
			unreadCount,
			pagination: {
				current: page,
				pages: Math.ceil(total / limit),
				total,
				hasNext: page < Math.ceil(total / limit),
				hasPrev: page > 1,
			},
		});
	} catch (error) {
		console.error('Error fetching notifications:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch notifications' },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const user = await getAuthenticatedUser(request);
		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { notificationIds, markAll } = await request.json();

		await ConnectToDb();

		if (markAll) {
			await NotificationModel.updateMany(
				{ recipient: user._id, isRead: false },
				{ isRead: true }
			);
		} else if (notificationIds && Array.isArray(notificationIds)) {
			await NotificationModel.updateMany(
				{
					_id: { $in: notificationIds },
					recipient: user._id,
				},
				{ isRead: true }
			);
		}

		return NextResponse.json({ message: 'Notifications marked as read' });
	} catch (error) {
		console.error('Error updating notifications:', error);
		return NextResponse.json(
			{ error: 'Failed to update notifications' },
			{ status: 500 }
		);
	}
}
