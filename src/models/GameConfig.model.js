import mongoose from 'mongoose';

const GameConfigSchema = new mongoose.Schema({
    userId: { type: Number, required: true },   // id Postgres
    gameId: { type: Number, required: true },   // id Postgres
    settings: { type: Object, default: {} },
    updatedAt: { type: Date, default: Date.now }
}, { collection: 'game_configs', timestamps: true });

GameConfigSchema.index({ userId: 1, gameId: 1 }, { unique: true });

export const GameConfig = mongoose.model('GameConfig', GameConfigSchema);
