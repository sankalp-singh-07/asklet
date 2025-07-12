import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
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
	message: {
		type: String,
		required: true,
	},
	relatedQuestion: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Question',
	},
	relatedAnswer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Answer',
	},
	isRead: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const NotificationModel =
	mongoose.models.Notification ||
	mongoose.model('Notification', notificationSchema);

export default NotificationModel;
