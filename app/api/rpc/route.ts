import { NextRequest, NextResponse } from 'next/server';

// Vercel serverless function configuration
export const runtime = 'edge'; // Use edge runtime for better performance
export const dynamic = 'force-dynamic'; // Disable caching for RPC requests

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

    let body;
    try {
        body = await req.json();
    } catch (parseError: any) {
        console.error('[Proxy] Failed to parse request body:', parseError.message);
        return NextResponse.json({ 
            jsonrpc: "2.0",
            id: null,
            error: { code: -32700, message: "Parse error" }
        }, { status: 400 });
    }

    try {

        // Heartbeat skip
        if (body.method !== 'eth_blockNumber' && body.method !== 'eth_getFilterChanges') {
            console.log(`[Proxy] [${body.method}] Requesting...`);
        }

        const fetchNode = async (url: string) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout for Vercel

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

        console.error('[Proxy] Critical Failure: All RPC nodes timed out or failed', lastError);

        // Return a valid JSON-RPC error response instead of just a raw text 502
        return NextResponse.json({
            jsonrpc: "2.0",
            id: body.id || 1,
            error: {
                code: -32603,
                message: "Internal RPC Proxy Error: All nodes offline",
                data: lastError?.message
            }
        }, { status: 200 }); // Return 200 with JSON-RPC error instead of 502

    } catch (error: any) {
        console.error('[Proxy] Unexpected error:', error);
        return NextResponse.json({ 
            jsonrpc: "2.0",
            id: body?.id || null,
            error: { 
                code: -32603, 
                message: "Internal server error",
                data: error.message 
            }
        }, { status: 200 }); // Return 200 with JSON-RPC error format
    }
}
