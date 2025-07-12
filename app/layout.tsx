import './globals.css';

export const metadata = {
	title: 'Asklet - Q&A Platform',
	description: 'Simple Q&A platform',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
