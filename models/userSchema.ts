import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			minlength: 3,
			maxlength: 40,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
		avatar: {
			type: String,
			default: null,
		},
		reputation: {
			type: Number,
			default: 0,
		},
		joinedAt: {
			type: Date,
			default: Date.now,
		},
		lastActive: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.index({ reputation: -1 });

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;
