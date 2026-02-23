const https = require('https');

const rpcs = [
    'https://bsc-testnet.publicnode.com',
    'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
    'https://data-seed-prebsc-2-s1.bnbchain.org:8545',
    'https://bsc-testnet.public.blastapi.io',
    'https://bnbt-rpc.beecoin.io',
    'https://testnet.bsc.quiknode.pro/db756f69dfc613c193b08709C6353155e975L86/'
];

async function checkRPC(url) {
    const start = Date.now();
    return new Promise((resolve) => {
        const req = https.request(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const duration = Date.now() - start;
                if (res.statusCode === 200) {
                    console.log(`✅ ${url} - ${duration}ms`);
                    resolve({ url, duration, status: 'ok' });
                } else {
                    console.log(`❌ ${url} - Error ${res.statusCode}`);
                    resolve({ url, duration, status: 'error' });
                }
            });
        });

        req.on('error', (e) => {
            console.log(`❌ ${url} - Failed: ${e.message}`);
            resolve({ url, duration: 99999, status: 'error' });
        });

        req.on('timeout', () => {
            req.destroy();
            console.log(`❌ ${url} - Timeout`);
            resolve({ url, duration: 99999, status: 'timeout' });
        });

        req.write(JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_blockNumber",
            params: [],
            id: 1
        }));
        req.end();
    });
}

async function main() {
    console.log("🏎️ Racing RPCs...");
    const results = await Promise.all(rpcs.map(checkRPC));
    const winner = results.filter(r => r.status === 'ok').sort((a, b) => a.duration - b.duration)[0];
    
    if (winner) {
        console.log(`\n🏆 WINNER: ${winner.url} (${winner.duration}ms)`);
    } else {
        console.error("\n💀 ALL RPCs FAILED");
    }
}

main();
