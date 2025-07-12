'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
	id: string;
	username: string;
	email: string;
	role: string;
}

interface ProtectedRouteProps {
	children: (user: User) => React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		try {
			const response = await fetch('/api/auth/me');
			if (response.ok) {
				const data = await response.json();
				setUser(data.user);
			} else {
				router.push('/landing');
			}
		} catch (error) {
			console.error('Auth check failed:', error);
			router.push('/landing');
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return <>{children(user)}</>;
}
