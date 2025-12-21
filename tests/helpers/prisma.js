import sinon from 'sinon';
import { prisma } from '../../src/config/prisma.js';

export function stubPrismaDelegate(sandbox, model, methods) {
    const original = prisma[model];
    const stubbed = {};

    for (const [method, behavior] of Object.entries(methods)) {
        if (typeof behavior === 'function') {
            stubbed[method] = sandbox.stub().callsFake(behavior);
        } else {
            stubbed[method] = sandbox.stub().resolves(behavior);
        }
    }

    Object.defineProperty(prisma, model, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: stubbed,
    });

    if (!sandbox.__prismaRestorers) sandbox.__prismaRestorers = [];
    sandbox.__prismaRestorers.push(() => {
        Object.defineProperty(prisma, model, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: original,
        });
    });

    return stubbed;
}

export function stubPrismaMethod(sandbox, methodName, implementation) {
    const original = prisma[methodName];
    const stub = sandbox.stub().callsFake(implementation);

    Object.defineProperty(prisma, methodName, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: stub,
    });

    if (!sandbox.__prismaRestorers) sandbox.__prismaRestorers = [];
    sandbox.__prismaRestorers.push(() => {
        Object.defineProperty(prisma, methodName, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: original,
        });
    });

    return stub;
}