import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) throw new Error('Add Mongo URI to .env.local');

export type MongooseGlobal = typeof globalThis & {
	mongoose: {
		promise: ReturnType<typeof mongoose.connect> | null;
		conn: typeof mongoose | null;
	};
};

let cachedDb = (global as MongooseGlobal).mongoose;

if (!cachedDb) {
	cachedDb = (global as MongooseGlobal).mongoose = {
		conn: null,
		promise: null,
	};
}

export async function ConnectToDb() {
	if (cachedDb.conn) {
		return cachedDb.conn;
	}

	if (!cachedDb.promise) {
		cachedDb.promise = mongoose
			.connect(MONGO_URI!, {
				bufferCommands: false,
			})
			.then((mongoose) => mongoose);
	}

	cachedDb.conn = await cachedDb.promise;
	return cachedDb.conn;
}
