// models/Answer.ts
import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
	content: {
		type: String,
		required: true,
	},
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
		upvotes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		downvotes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	isAccepted: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

answerSchema.virtual('voteScore').get(function () {
	return (
		(this.votes?.upvotes?.length || 0) -
		(this.votes?.downvotes?.length || 0)
	);
});

const AnswerModel =
	mongoose.models.Answer || mongoose.model('Answer', answerSchema);

export default AnswerModel;
