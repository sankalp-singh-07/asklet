import { NextRequest, NextResponse } from 'next/server';
import { ConnectToDb } from '@/lib/mongodb';
import NotificationModel from '@/models/notificationSchema';
import { getAuthenticatedUser } from '@/middleware';
import { sendRealtimeNotification } from './stream/route';

// GET notifications
export async function GET(request: NextRequest) {
	try {
		const user = await getAuthenticatedUser(request);
		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		await ConnectToDb();

		const notifications = await NotificationModel.find({
			recipient: user._id,
		})
			.populate('sender', 'username')
			.sort({ createdAt: -1 })
			.limit(20);

		const unreadCount = await NotificationModel.countDocuments({
			recipient: user._id,
			isRead: false,
		});

		return NextResponse.json({ notifications, unreadCount });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch notifications' },
			{ status: 500 }
		);
	}
}

// POST - Create notification (for testing)
export async function POST(request: NextRequest) {
	try {
		const user = await getAuthenticatedUser(request);
		if (!user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const { recipientId, message, type } = await request.json();

		await ConnectToDb();

		const notification = await NotificationModel.create({
			recipient: recipientId,
			sender: user._id,
			type: type || 'answer',
			message,
		});

		await notification.populate('sender', 'username');

		// Send real-time notification
		sendRealtimeNotification(recipientId, {
			_id: notification._id,
			message: notification.message,
			sender: notification.sender,
			type: notification.type,
			createdAt: notification.createdAt,
		});

		return NextResponse.json(notification, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to create notification' },
			{ status: 500 }
		);
	}
}

// PUT - Mark as read
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
				{ recipient: user._id },
				{ isRead: true }
			);
		} else if (notificationIds) {
			await NotificationModel.updateMany(
				{ _id: { $in: notificationIds }, recipient: user._id },
				{ isRead: true }
			);
		}

		return NextResponse.json({ message: 'Marked as read' });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to update' },
			{ status: 500 }
		);
	}
}
