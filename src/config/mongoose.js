import mongoose from 'mongoose';
import { MONGODB_URI } from './env.js';

export async function connectMongo() {
    await mongoose.connect(MONGODB_URI, { dbName: 'maets' });
}
