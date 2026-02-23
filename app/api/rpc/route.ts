import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ status: 'ok', branding: 'Citadel Proxy Active' });
}

export async function POST(req: NextRequest) {
    const rpcUrls = [
        'https://bsc-testnet.bnbchain.org',
        'https://bsc-testnet.publicnode.com',
        'https://data-seed-prebsc-1-s1.binance.org:8545',
        'https://data-seed-prebsc-2-s1.binance.org:8545',
        'https://data-seed-prebsc-1-s2.binance.org:8545',
        'https://data-seed-prebsc-2-s3.binance.org:8545',
        'https://bsc-testnet.drpc.org',
    ];

    try {
        const body = await req.json();

        // Heartbeat skip
        if (body.method !== 'eth_blockNumber' && body.method !== 'eth_getFilterChanges') {
            console.log(`[Proxy] [${body.method}] Requesting...`);
        }

        const fetchNode = async (url: string) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s for testnet

            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);

                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                // If the node returns a JSON-RPC error, we return it normally
                // Only throw if the network/fetch itself failed
                return data;
            } catch (err: any) {
                clearTimeout(timeoutId);
                throw err;
            }
        };

        // Try-Retry-Fail strategy
        let lastError: any = null;

        // Attempt 1: Race the best 3 nodes
        try {
            const result = await Promise.any(rpcUrls.slice(0, 3).map(fetchNode));
            return NextResponse.json(result);
        } catch (err) {
            lastError = err;
            console.warn(`[Proxy] Initial race failed, falling back to full list...`);

            // Attempt 2: Race ALL nodes
            try {
                const result = await Promise.any(rpcUrls.map(fetchNode));
                return NextResponse.json(result);
            } catch (innerErr) {
                lastError = innerErr;
            }
        }

        console.error('[Proxy] Critical Failure: All RPC nodes timed out or failed');

        // Return a valid JSON-RPC error response instead of just a raw text 502
        return NextResponse.json({
            jsonrpc: "2.0",
            id: body.id || 1,
            error: {
                code: -32603,
                message: "Internal RPC Proxy Error: All nodes offline",
                data: lastError?.message
            }
        }, { status: 502 });

    } catch (error: any) {
        return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }
}
