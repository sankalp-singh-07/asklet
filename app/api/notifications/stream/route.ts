import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/middleware';

// Simple in-memory store for active connections
const connections = new Map<string, ReadableStreamDefaultController>();

export async function GET(request: NextRequest) {
	const user = await getAuthenticatedUser(request);
	if (!user) {
		return new Response('Unauthorized', { status: 401 });
	}

	const userId = user._id.toString();

	const stream = new ReadableStream({
		start(controller) {
			// Store connection
			connections.set(userId, controller);

			// Send initial message
			const data = `data: ${JSON.stringify({
				type: 'connected',
				message: 'Connected',
			})}\n\n`;
			controller.enqueue(new TextEncoder().encode(data));
		},
		cancel() {
			// Clean up on disconnect
			connections.delete(userId);
		},
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive',
		},
	});
}

// Helper function to send notifications (export this)
export function sendRealtimeNotification(userId: string, notification: any) {
	const controller = connections.get(userId);
	if (controller) {
		try {
			const data = `data: ${JSON.stringify({
				type: 'notification',
				data: notification,
			})}\n\n`;
			controller.enqueue(new TextEncoder().encode(data));
		} catch (error) {
			console.error('Failed to send notification:', error);
			connections.delete(userId);
		}
	}
}
