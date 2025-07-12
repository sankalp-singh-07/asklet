// scripts/seed-data.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/stackit');

// Simple schemas (adjust paths as needed)
const UserSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	reputation: { type: Number, default: 0 },
	role: { type: String, default: 'user' },
	avatar: { type: String, default: null },
	joinedAt: { type: Date, default: Date.now },
	lastActive: { type: Date, default: Date.now },
});

const QuestionSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	tags: [{ type: String }],
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	votes: {
		upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	},
	acceptedAnswer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Answer',
		default: null,
	},
	views: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

const AnswerSchema = new mongoose.Schema({
	content: { type: String, required: true },
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	question: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Question',
		required: true,
	},
	votes: {
		upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	},
	isAccepted: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

const NotificationSchema = new mongoose.Schema({
	recipient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	type: {
		type: String,
		enum: ['answer', 'comment', 'mention', 'accept'],
		required: true,
	},
	message: { type: String, required: true },
	relatedQuestion: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
	relatedAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer' },
	isRead: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
});

const TagSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true, lowercase: true },
	description: { type: String, default: '' },
	questionCount: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now },
});

// Create models
const UserModel = mongoose.model('User', UserSchema);
const QuestionModel = mongoose.model('Question', QuestionSchema);
const AnswerModel = mongoose.model('Answer', AnswerSchema);
const NotificationModel = mongoose.model('Notification', NotificationSchema);
const TagModel = mongoose.model('Tag', TagSchema);

async function seedData(): Promise<void> {
	try {
		// Clear existing data
		await UserModel.deleteMany({});
		await QuestionModel.deleteMany({});
		await AnswerModel.deleteMany({});
		await NotificationModel.deleteMany({});
		await TagModel.deleteMany({});

		console.log('🧹 Cleared existing data');

		// Create users
		const hashedPassword = await bcrypt.hash('password123', 10);

		const users = await UserModel.create([
			{
				username: 'john_doe',
				email: 'john@example.com',
				password: hashedPassword,
				reputation: 150,
				role: 'user',
			},
			{
				username: 'jane_smith',
				email: 'jane@example.com',
				password: hashedPassword,
				reputation: 200,
				role: 'user',
			},
			{
				username: 'dev_mike',
				email: 'mike@example.com',
				password: hashedPassword,
				reputation: 75,
				role: 'user',
			},
			{
				username: 'admin_user',
				email: 'admin@example.com',
				password: hashedPassword,
				reputation: 500,
				role: 'admin',
			},
		]);

		console.log(
			'👥 Created users:',
			users.map((u) => u.username)
		);

		// Create tags
		const tags = await TagModel.create([
			{
				name: 'nextjs',
				description: 'Next.js React framework',
				questionCount: 1,
			},
			{ name: 'jwt', description: 'JSON Web Tokens', questionCount: 1 },
			{
				name: 'authentication',
				description: 'User authentication',
				questionCount: 1,
			},
			{
				name: 'mongodb',
				description: 'MongoDB database',
				questionCount: 1,
			},
			{
				name: 'database',
				description: 'Database design',
				questionCount: 1,
			},
			{
				name: 'schema',
				description: 'Database schema design',
				questionCount: 1,
			},
			{ name: 'react', description: 'React library', questionCount: 2 },
			{
				name: 'notifications',
				description: 'Real-time notifications',
				questionCount: 1,
			},
			{
				name: 'realtime',
				description: 'Real-time applications',
				questionCount: 1,
			},
			{
				name: 'typescript',
				description: 'TypeScript language',
				questionCount: 1,
			},
			{
				name: 'javascript',
				description: 'JavaScript programming',
				questionCount: 1,
			},
		]);

		console.log(
			'🏷️ Created tags:',
			tags.map((t) => t.name)
		);

		// Create questions
		const questions = await QuestionModel.create([
			{
				title: 'How to implement JWT authentication in Next.js?',
				description: `
					<p>I need help implementing JWT authentication in my Next.js app. What are the best practices?</p>
					<p>Here's what I'm trying to achieve:</p>
					<ul>
						<li>Secure login/logout</li>
						<li>Protected routes</li>
						<li>Token refresh mechanism</li>
					</ul>
					<p>Any recommendations on libraries or approaches?</p>
				`,
				tags: ['nextjs', 'jwt', 'authentication'],
				author: users[0]._id,
				views: 45,
			},
			{
				title: 'Best practices for MongoDB schema design?',
				description: `
					<p>What are some best practices when designing MongoDB schemas for a Q&A platform?</p>
					<p>Specifically looking for advice on:</p>
					<ul>
						<li>When to use references vs embedded documents</li>
						<li>Indexing strategies</li>
						<li>Handling relationships between users, questions, and answers</li>
					</ul>
				`,
				tags: ['mongodb', 'database', 'schema'],
				author: users[1]._id,
				views: 23,
			},
			{
				title: 'How to handle real-time notifications in React?',
				description: `
					<p>I want to implement real-time notifications in my React app. Should I use WebSockets or Server-Sent Events?</p>
					<p>Requirements:</p>
					<ul>
						<li>Show notification badge with unread count</li>
						<li>Real-time updates when new notifications arrive</li>
						<li>Dropdown list of recent notifications</li>
					</ul>
					<p>What's the simplest approach that works reliably?</p>
				`,
				tags: ['react', 'notifications', 'realtime'],
				author: users[2]._id,
				views: 67,
			},
			{
				title: 'TypeScript vs JavaScript for large applications?',
				description: `
					<p>We're starting a new large-scale application and debating between TypeScript and JavaScript.</p>
					<p>What are the main benefits of TypeScript for:</p>
					<ul>
						<li>Team collaboration</li>
						<li>Code maintainability</li>
						<li>Bug prevention</li>
					</ul>
					<p>Is the learning curve worth it?</p>
				`,
				tags: ['typescript', 'javascript'],
				author: users[3]._id,
				views: 89,
			},
			{
				title: 'React performance optimization techniques?',
				description: `
					<p>My React app is getting slow with large datasets. What are the best optimization techniques?</p>
					<p>Current issues:</p>
					<ul>
						<li>Slow rendering with 1000+ items</li>
						<li>Unnecessary re-renders</li>
						<li>Memory leaks in useEffect</li>
					</ul>
				`,
				tags: ['react', 'javascript'],
				author: users[0]._id,
				views: 134,
			},
		]);

		console.log(
			'❓ Created questions:',
			questions.map((q) => q.title)
		);

		// Create answers
		const answers = await AnswerModel.create([
			{
				content: `
					<p>You can use NextAuth.js for easy JWT implementation. Here's a basic setup:</p>
					<pre><code>
// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Add your authentication logic here
        const user = { id: 1, email: credentials.email }
        return user
      }
    })
  ],
  session: { strategy: 'jwt' }
})
					</code></pre>
					<p>This provides secure authentication with automatic token handling.</p>
				`,
				author: users[1]._id,
				question: questions[0]._id,
			},
			{
				content: `
					<p>For MongoDB schemas, consider using references for relationships and embedded documents for frequently accessed data.</p>
					<p><strong>Use References when:</strong></p>
					<ul>
						<li>Data is accessed independently</li>
						<li>Relationships are many-to-many</li>
						<li>Document size could grow large</li>
					</ul>
					<p><strong>Use Embedded Documents when:</strong></p>
					<ul>
						<li>Data is always accessed together</li>
						<li>One-to-few relationships</li>
						<li>Document size stays reasonable</li>
					</ul>
					<p>For a Q&A platform, I'd recommend references for user-question relationships and embedded votes.</p>
				`,
				author: users[2]._id,
				question: questions[1]._id,
			},
			{
				content: `
					<p>Server-Sent Events are perfect for notifications since they're one-way communication from server to client.</p>
					<p>Here's a simple implementation:</p>
					<pre><code>
// Client side
const eventSource = new EventSource('/api/notifications/stream');
eventSource.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  setNotifications(prev => [notification, ...prev]);
};

// Server side (Next.js API route)
export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      // Send notifications to this controller
    }
  });
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' }
  });
}
					</code></pre>
					<p>SSE automatically handles reconnection and is simpler than WebSockets for this use case.</p>
				`,
				author: users[0]._id,
				question: questions[2]._id,
				isAccepted: true,
			},
			{
				content: `
					<p>TypeScript is absolutely worth it for large applications! Here's why:</p>
					<p><strong>Benefits:</strong></p>
					<ul>
						<li><strong>Type Safety:</strong> Catches errors at compile time</li>
						<li><strong>Better IDE Support:</strong> Autocomplete, refactoring, navigation</li>
						<li><strong>Self-Documenting:</strong> Types serve as documentation</li>
						<li><strong>Easier Refactoring:</strong> Confident large-scale changes</li>
					</ul>
					<p>The learning curve is minimal if your team knows JavaScript. Start gradually by adding types to new code.</p>
				`,
				author: users[1]._id,
				question: questions[3]._id,
				isAccepted: true,
			},
			{
				content: `
					<p>Here are key React optimization techniques:</p>
					<p><strong>1. React.memo for expensive components:</strong></p>
					<pre><code>const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});</code></pre>
					<p><strong>2. useMemo for expensive calculations:</strong></p>
					<pre><code>const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);</code></pre>
					<p><strong>3. Virtualization for large lists:</strong></p>
					<p>Use libraries like react-window for rendering only visible items.</p>
					<p><strong>4. Proper dependency arrays in useEffect</strong></p>
				`,
				author: users[2]._id,
				question: questions[4]._id,
			},
			{
				content: `
					<p>Additionally, consider using React DevTools Profiler to identify performance bottlenecks.</p>
					<p>For memory leaks in useEffect, always clean up:</p>
					<pre><code>useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);</code></pre>
					<p>Also consider lazy loading components with React.lazy() for code splitting.</p>
				`,
				author: users[3]._id,
				question: questions[4]._id,
			},
		]);

		console.log('💡 Created answers:', answers.length);

		// Update questions with accepted answers
		await QuestionModel.findByIdAndUpdate(questions[2]._id, {
			acceptedAnswer: answers[2]._id,
		});
		await QuestionModel.findByIdAndUpdate(questions[3]._id, {
			acceptedAnswer: answers[3]._id,
		});

		// Add some votes to questions and answers
		await QuestionModel.findByIdAndUpdate(questions[0]._id, {
			$push: {
				'votes.upvotes': { $each: [users[1]._id, users[2]._id] },
			},
		});
		await QuestionModel.findByIdAndUpdate(questions[2]._id, {
			$push: {
				'votes.upvotes': {
					$each: [users[0]._id, users[1]._id, users[3]._id],
				},
			},
		});

		await AnswerModel.findByIdAndUpdate(answers[0]._id, {
			$push: {
				'votes.upvotes': { $each: [users[0]._id, users[2]._id] },
			},
		});
		await AnswerModel.findByIdAndUpdate(answers[2]._id, {
			$push: {
				'votes.upvotes': {
					$each: [users[1]._id, users[2]._id, users[3]._id],
				},
			},
		});

		console.log('👍 Added votes to questions and answers');

		// Create notifications
		const notifications = await NotificationModel.create([
			{
				recipient: users[0]._id,
				sender: users[1]._id,
				type: 'answer',
				message:
					'jane_smith answered your question about JWT authentication',
				relatedQuestion: questions[0]._id,
				relatedAnswer: answers[0]._id,
			},
			{
				recipient: users[1]._id,
				sender: users[2]._id,
				type: 'answer',
				message:
					'dev_mike answered your question about MongoDB schema design',
				relatedQuestion: questions[1]._id,
				relatedAnswer: answers[1]._id,
			},
			{
				recipient: users[0]._id,
				sender: users[2]._id,
				type: 'accept',
				message:
					'Your answer was accepted for the real-time notifications question',
				relatedQuestion: questions[2]._id,
				relatedAnswer: answers[2]._id,
			},
			{
				recipient: users[1]._id,
				sender: users[3]._id,
				type: 'accept',
				message:
					'Your answer was accepted for the TypeScript vs JavaScript question',
				relatedQuestion: questions[3]._id,
				relatedAnswer: answers[3]._id,
			},
			{
				recipient: users[0]._id,
				sender: users[2]._id,
				type: 'answer',
				message:
					'dev_mike answered your question about React performance',
				relatedQuestion: questions[4]._id,
				relatedAnswer: answers[4]._id,
			},
		]);

		console.log('🔔 Created notifications:', notifications.length);

		console.log('\n✅ Seed data created successfully!');
		console.log('\n📋 Test Users:');
		console.log(
			'Email: john@example.com | Password: password123 | Role: user'
		);
		console.log(
			'Email: jane@example.com | Password: password123 | Role: user'
		);
		console.log(
			'Email: mike@example.com | Password: password123 | Role: user'
		);
		console.log(
			'Email: admin@example.com | Password: password123 | Role: admin'
		);

		console.log('\n🔗 User IDs for testing:');
		users.forEach((user) => {
			console.log(`${user.username}: ${user._id}`);
		});

		console.log('\n📊 Data Summary:');
		console.log(`Users: ${users.length}`);
		console.log(`Questions: ${questions.length}`);
		console.log(`Answers: ${answers.length}`);
		console.log(`Notifications: ${notifications.length}`);
		console.log(`Tags: ${tags.length}`);

		console.log('\n🧪 Test API endpoints:');
		console.log('GET /api/questions - List all questions');
		console.log('GET /api/questions/[id] - Get question details');
		console.log('GET /api/notifications - Get user notifications');
		console.log('GET /api/users/[username] - Get user profile');
		console.log('GET /api/tags - Get all tags');
	} catch (error) {
		console.error('❌ Error seeding data:', error);
	} finally {
		await mongoose.connection.close();
		console.log('🔌 Database connection closed');
	}
}

seedData();
