'use client';

import ProtectedRoute from '../components/ProtectedRoutes';

export default function HomePage() {
	return (
		<ProtectedRoute>
			{(user) => (
				<div className="container mx-auto p-4">
					<h1 className="text-3xl font-bold mb-4">
						Welcome, {user.username}!
					</h1>
					<p className="text-lg mb-4">
						You are now logged in and can access this page.
					</p>
					<LogoutButton />
				</div>
			)}
		</ProtectedRoute>
	);
}

function LogoutButton() {
	const handleLogout = async () => {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
			window.location.href = '/landing';
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	return (
		<button
			onClick={handleLogout}
			className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
		>
			Logout
		</button>
	);
}
