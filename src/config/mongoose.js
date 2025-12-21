import mongoose from 'mongoose';
import { MONGODB_URI as ENV_URI } from './env.js';

let cachedPromise;

export async function connectMongo() {
    if (cachedPromise) return cachedPromise;

    const uri =
        ENV_URI ||
        process.env.MONGO_URI || // fallback si ton .env utilise MONGO_URI
        'mongodb://127.0.0.1:27017/maets';

    mongoose.set('strictQuery', true);

    cachedPromise = mongoose.connect(uri, {
        dbName: 'maets',
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 5,
    });

    await cachedPromise;
    return cachedPromise;
}