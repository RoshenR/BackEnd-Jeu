import fs from 'fs';
const { version } = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url)));
export const openapiSpec = {
    openapi: '3.0.0',
    info: { title: 'Maets API', version },
    servers: [{ url: 'http://localhost:3000' }],
    paths: {
        '/auth/register': { post: { summary: 'Register', responses: { '201': { description: 'Created' }}} },
        '/auth/login':    { post: { summary: 'Login',    responses: { '200': { description: 'OK' }}} },
        '/games':         { get:  { summary: 'List games' }, post: { summary: 'Create game' } },
        '/games/{gameId}':{ delete: { summary: 'Delete game' } },
        '/library':       { get:  { summary: 'My library' } },
        '/library/{gameId}': {
            post: { summary: 'Add to my library' },
            delete: { summary: 'Remove from my library' }
        },
        '/library/{gameId}/config': {
            get: { summary: 'Get my game config' },
            put: { summary: 'Upsert my game config' }
        },
        '/admin/grant':   { post: { summary: 'Grant a game to a user (admin)' } }
    }
};
