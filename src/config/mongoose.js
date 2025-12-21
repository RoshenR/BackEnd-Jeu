import fs from 'node:fs';
import mongoose from 'mongoose';
import { MONGODB_URI as ENV_URI } from './env.js';

let cachedPromise;

export async function connectMongo() {
    if (cachedPromise) return cachedPromise;

    const baseUri =        ENV_URI ||
        process.env.MONGO_URI || // fallback si ton .env utilise MONGO_URI
        'mongodb://127.0.0.1:27017/maets';

    const uri = resolveMongoUri(baseUri);

    mongoose.set('strictQuery', true);

    cachedPromise = mongoose.connect(uri, {
        dbName: 'maets',
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 5,
    });

    await cachedPromise;
    return cachedPromise;
}

function resolveMongoUri(baseUri) {
    if (isRunningInDocker()) return baseUri;

    try {
        const parsed = new URL(baseUri);
        if (parsed.hostname === 'mongo') {
            parsed.hostname = '127.0.0.1';
            return parsed.toString();
        }
    } catch (error) {
        console.warn('⚠️ MongoDB URI invalide, utilisation telle quelle.', error);
    }

    return baseUri;
}

function isRunningInDocker() {
    if (process.env.DOCKER || process.env.CONTAINER) return true;

    if (fs.existsSync('/.dockerenv')) return true;

    try {
        const cgroup = fs.readFileSync('/proc/1/cgroup', 'utf8');
        return cgroup.includes('docker') || cgroup.includes('containerd');
    } catch (error) {
        return false;
    }
}

