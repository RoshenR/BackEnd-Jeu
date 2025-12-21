import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@maets.dev' },
        update: {},
        create: { email: 'admin@maets.dev', passwordHash, role: 'ADMIN' }
    });

    await prisma.game.createMany({
        data: [
            { title: 'Hollow Knight', publisher: 'Team Cherry', year: 2017 },
            { title: 'Celeste', publisher: 'Maddy Makes Games', year: 2018 }
        ],
        skipDuplicates: true
    });
    console.log('Seed done');
}

main().finally(() => prisma.$disconnect());
