import { performance } from 'perf_hooks';

const baseUrl = process.env.BASE_URL || 'http://localhost:3001/api/health';
const total = Number(process.env.TOTAL_REQUESTS || 2000);
const concurrency = Number(process.env.CONCURRENCY || 50);

if (!Number.isFinite(total) || total < 1) {
    console.error('TOTAL_REQUESTS must be a positive number');
    process.exit(1);
}

if (!Number.isFinite(concurrency) || concurrency < 1) {
    console.error('CONCURRENCY must be a positive number');
    process.exit(1);
}

const batches = Math.ceil(total / concurrency);
let completed = 0;

console.log(`🚀 Benchmarking ${baseUrl}`);
console.log(`➡️  total requests: ${total}, concurrency: ${concurrency}`);

const start = performance.now();

for (let batch = 0; batch < batches; batch += 1) {
    const batchSize = Math.min(concurrency, total - batch * concurrency);
    const requests = Array.from({ length: batchSize }, async () => {
        const response = await fetch(baseUrl);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        completed += 1;
    });

    await Promise.all(requests);
    process.stdout.write(`\r✅ Completed ${completed}/${total}`);
}

const durationMs = performance.now() - start;
console.log(`\n🏁 Done in ${(durationMs / 1000).toFixed(2)}s`);