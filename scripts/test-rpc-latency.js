const https = require('https');
const http = require('http');

const rpcUrls = [
    'https://bsc-testnet.publicnode.com',
    'https://public.stackup.sh/api/v1/node/bsc-testnet',
    'https://data-seed-prebsc-1-s1.binance.org:8545',
    'https://data-seed-prebsc-2-s1.binance.org:8545',
    'https://rpc.ankr.com/bsc_testnet_chapel',
    'https://data-seed-prebsc-1-s3.binance.org:8545',
    'https://bsc-testnet.drpc.org',
    'https://bsc-testnet.blockpi.network/v1/rpc/public'
];

const body = JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1
});

async function checkRpc(url) {
    return new Promise((resolve) => {
        const start = Date.now();
        const lib = url.startsWith('https') ? https : http;
        
        const req = lib.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': body.length
            },
            timeout: 5000 // 5s timeout
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                const duration = Date.now() - start;
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        if (json.result) {
                             resolve({ url, duration, status: 'OK', block: parseInt(json.result, 16) });
                        } else {
                             resolve({ url, duration, status: 'ERROR', error: 'Invalid JSON response' });
                        }
                    } catch (e) {
                         resolve({ url, duration, status: 'ERROR', error: 'Parse Error' });
                    }
                } else {
                    resolve({ url, duration, status: `HTTP ${res.statusCode}` });
                }
            });
        });

        req.on('error', (e) => {
            resolve({ url, duration: Date.now() - start, status: 'ERROR', error: e.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ url, duration: Date.now() - start, status: 'TIMEOUT' });
        });

        req.write(body);
        req.end();
    });
}

async function run() {
    console.log('Testing RPC Latency...');
    const results = await Promise.all(rpcUrls.map(checkRpc));
    
    // Sort by duration, prioritize OK
    results.sort((a, b) => {
        if (a.status === 'OK' && b.status !== 'OK') return -1;
        if (a.status !== 'OK' && b.status === 'OK') return 1;
        return a.duration - b.duration;
    });

    console.table(results);
}

run();
