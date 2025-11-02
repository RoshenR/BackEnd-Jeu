// tests/setup.js
import { connectMongo } from '../src/config/mongoose.js';
// si tu as une fonction pour fermer la connexion :
import mongoose from 'mongoose';

before(async () => {
    await connectMongo();
});

after(async () => {
    try { await mongoose.connection.close(); } catch {}
});
