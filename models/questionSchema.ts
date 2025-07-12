import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
		maxlength: 400,
	},
	description: {
		type: String,
		required: true,
	},
	tags: [
		{
			type: String,
			trim: true,
			lowercase: true,
		},
	],
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
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
	acceptedAnswer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Answer',
		default: null,
	},
	views: {
		type: Number,
		default: 0,
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

questionSchema.virtual('voteScore').get(function () {
	return (
		(this.votes?.upvotes?.length || 0) -
		(this.votes?.downvotes?.length || 0)
	);
});

const QuestionModel =
	mongoose.models.Question || mongoose.model('Question', questionSchema);

export default QuestionModel;
