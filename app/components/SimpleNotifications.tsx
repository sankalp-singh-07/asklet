'use client';
import { useState, useEffect } from 'react';

interface Notification {
	_id: string;
	message: string;
	sender: { username: string };
	type: string;
	createdAt: string;
	isRead?: boolean;
}

export default function SimpleNotifications() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		// Fetch initial notifications
		fetchNotifications();

		// Setup SSE connection
		const eventSource = new EventSource('/api/notifications/stream');

		eventSource.onopen = () => {
			setIsConnected(true);
			console.log('📡 Connected to notifications');
		};

		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data);

			if (data.type === 'notification') {
				setNotifications((prev) => [data.data, ...prev]);
				setUnreadCount((prev) => prev + 1);

				// Simple browser notification
				if (Notification.permission === 'granted') {
					new Notification('Asklet Notification', {
						body: data.data.message,
						icon: '/favicon.ico',
					});
				}
			}
		};

		eventSource.onerror = () => {
			setIsConnected(false);
			console.log('❌ Disconnected from notifications');
		};

		// Request notification permission
		if (Notification.permission === 'default') {
			Notification.requestPermission();
		}

		return () => eventSource.close();
	}, []);

	const fetchNotifications = async () => {
		try {
			const response = await fetch('/api/notifications');
			const data = await response.json();
			setNotifications(data.notifications || []);
			setUnreadCount(data.unreadCount || 0);
		} catch (error) {
			console.error('Failed to fetch notifications:', error);
		}
	};

	const markAllAsRead = async () => {
		try {
			await fetch('/api/notifications', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ markAll: true }),
			});
			setUnreadCount(0);
			setNotifications((prev) =>
				prev.map((n) => ({ ...n, isRead: true }))
			);
		} catch (error) {
			console.error('Failed to mark as read:', error);
		}
	};

	return (
		<div className="relative">
			{/* Notification Bell */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="relative p-2 text-gray-600 hover:text-gray-900"
			>
				{/* Bell Icon */}
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
					/>
				</svg>

				{/* Unread Badge */}
				{unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
						{unreadCount > 9 ? '9+' : unreadCount}
					</span>
				)}

				{/* Connection Status */}
				<span
					className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${
						isConnected ? 'bg-green-500' : 'bg-red-500'
					}`}
				/>
			</button>

			{/* Dropdown */}
			{isOpen && (
				<div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
					{/* Header */}
					<div className="p-4 border-b flex justify-between items-center">
						<h3 className="font-semibold">Notifications</h3>
						<div className="flex items-center space-x-2">
							<span
								className={`text-xs px-2 py-1 rounded ${
									isConnected
										? 'bg-green-100 text-green-800'
										: 'bg-red-100 text-red-800'
								}`}
							>
								{isConnected ? 'Live' : 'Offline'}
							</span>
							{unreadCount > 0 && (
								<button
									onClick={markAllAsRead}
									className="text-sm text-blue-600 hover:text-blue-800"
								>
									Mark all read
								</button>
							)}
						</div>
					</div>

					{/* Notifications List */}
					<div className="max-h-96 overflow-y-auto">
						{notifications.length === 0 ? (
							<div className="p-4 text-center text-gray-500">
								No notifications yet
							</div>
						) : (
							notifications.map((notification) => (
								<div
									key={notification._id}
									className={`p-3 border-b hover:bg-gray-50 ${
										!notification.isRead ? 'bg-blue-50' : ''
									}`}
								>
									<div className="flex justify-between items-start">
										<div className="flex-1">
											<p className="text-sm">
												{notification.message}
											</p>
											<p className="text-xs text-gray-500 mt-1">
												by{' '}
												{notification.sender.username} •{' '}
												{new Date(
													notification.createdAt
												).toLocaleTimeString()}
											</p>
										</div>
										{!notification.isRead && (
											<span className="ml-2 h-2 w-2 bg-blue-600 rounded-full flex-shrink-0" />
										)}
									</div>
								</div>
							))
						)}
					</div>

					{/* Test Button */}
					<div className="p-3 border-t">
						<button
							onClick={async () => {
								try {
									await fetch('/api/notifications', {
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
										},
										body: JSON.stringify({
											recipientId: 'your-user-id', // Replace with actual user ID
											message:
												'Test notification at ' +
												new Date().toLocaleTimeString(),
											type: 'test',
										}),
									});
								} catch (error) {
									console.error(
										'Failed to send test notification:',
										error
									);
								}
							}}
							className="w-full text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded"
						>
							Send Test Notification
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
