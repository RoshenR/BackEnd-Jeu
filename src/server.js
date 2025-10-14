import { PORT } from './config/env.js';
import { prisma } from './config/prisma.js';
import { connectMongo } from './config/mongoose.js';
import app from './app.js';

async function bootstrap() {
    await connectMongo();
    await prisma.$connect();
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}
bootstrap();
