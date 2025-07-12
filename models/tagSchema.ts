import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
	},
	description: {
		type: String,
		default: '',
	},
	questionCount: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const TagModel = mongoose.models.Tag || mongoose.model('Tag', tagSchema);

export default TagModel;
