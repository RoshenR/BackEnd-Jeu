import fs from 'fs';
import https from 'https';
import app from './app.js';
import { PORT } from './config/env.js';
import { prisma } from './config/prisma.js';
import { connectMongo } from './config/mongoose.js';

async function bootstrap() {
    try {
        await connectMongo();
        await prisma.$connect();

        const useHttps = process.env.HTTPS === 'true';
        const port = PORT || 3000;

        if (useHttps) {
            const key = fs.readFileSync('./certs/localhost-key.pem');
            const cert = fs.readFileSync('./certs/localhost.pem');

            https.createServer({ key, cert }, app).listen(port, () => {
                console.log(`✅ HTTPS API running on https://localhost:${port}`);
            });
        } else {
            app.listen(port, () => {
                console.log(`✅ HTTP API running on http://localhost:${port}`);
            });
        }
    } catch (err) {
        console.error('❌ Server initialization failed:', err);
        process.exit(1);
    }
}

bootstrap();
